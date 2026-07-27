# App-Mobile Audit Application Architecture & Rules

This document provides persistent context for the App-Mobile React application, specifically focusing on the dynamic Audit forms (`Venue`, `Network`, `Power`). It is automatically read by the AI agent at the start of every new chat.

## System Architecture
- **Framework:** React + Vite + React Hook Form (using `mode: 'onBlur'` for performance).
- **Routing:** React Router DOM.
- **Styling:** Tailwind CSS + custom SVG icons.
- **Offline/Draft Storage:** IndexedDB (via `storageService.js`) is used instead of `localStorage` to handle gigabytes of base64 image strings and offline drafts without crashing the browser or hitting quota limits.

## API & Data Mapping Quirks (Critical)
- **Odoo Base64 Double Encoding:** The backend (Odoo) often double-encodes base64 image strings (which usually start with `LzlqLzRB...`). **Always** use the `decodeOdooImage` helper function from `src/components/audit/utils/imageUtils.js` when mapping images received from the API.
- **Lazy Loading Images:** Do not fetch all images on report initialization to prevent massive API payloads. List-based images (like device photos and equipment documents) should be initialized with `{ pendingFetch: true, odooId: item.id, isFromServer: true }` and lazy-loaded via `reportApiService.fetchLineImage` inside `useAuditWizard` when their specific subsection is active.
- **Read-Only Fields Patching:** When saving a section, ensure that read-only fields (like the Auditor/Auditee details in the `PersonnelInfo` tab, which map to the `auditeeAuditor` payload) are **excluded** from the standard `patchAuditSection` API call. Pushing them causes 400-level errors and infinite retries.
- **Signatures Mapping:** Signatures are routed directly to the `signatures` JSON object rather than the standard fields.
- **Observations:** The GET API returns `observationLines` as `{ id, name }`. This must be specifically mapped to `observation` in the `obs_list` numbered-text-list schema.
- **Strict Integer Casting:** Odoo's PostgreSQL backend crashes with 400 Bad Request if you send a string to an integer field. **Always** cast HTML `number` and `node-counts` inputs with `Number(val)` before sending them in a PATCH payload (e.g. inside `venueAuditService.js`).
- **Venue System Details Mapping:** The Venue Audit `systemDetails` PATCH payload expects strictly **camelCase** keys grouped into nested objects (e.g., `nodeDetails`, `processorDetails`, `osDetails`, `ramDetails`, etc.), *not* a flat snake_case list.
- **Image Caching Bypass:** We do not cache individual image items in `storageService` anymore. `reportApiService.fetchLineImage` unconditionally hits the network to guarantee the user sees the latest backend edits.
- **Unified Authentication:** The audit feature does not manage its own auth state or context. `httpClient.js` dynamically reads the main application's `serverApiKey` and `loginData` directly from `localStorage` on every request.
- **Live Server Proxy (Web Dev):** When testing on the web (Vite), requests to `/api` are automatically proxied to `https://erp.eduquity.com` to bypass CORS.
- **Wizard Route/Context Fallback:** Audit wizards (`VenueAuditWizard`, `NetworkAuditWizard`, `PowerAuditWizard`) pull `odooData` from `location.state` when navigating internally, with an automated fallback to searching `AuditContext` reports using `useParams()` (`reportId`) when refreshed or accessed via direct URL.
- **Network Security Compliance Mapping:** Security compliance questions map to `security_compliance_lines` (with fallbacks for `security_compliance` / `securityCompliance` payload keys) and support multiple backend attribute fallbacks (`category`/`head`/`section_name`, `remarks`/`description`/`evidence`/`findings`).
- **Read-Only Field Enforcements:** Auditor/Auditee information across all audit forms (`Venue`, `Network`, `Power`) and Auditor Name in Conclusion are strictly configured with `readOnly: true`.

## Recent Changes (July 2026)
- **Image Mapping:** Refactored `networkAuditService.js` and `powerAuditService.js` to correctly map dynamic arrays (`devicePhotos`, `equipmentDocuments`).
- **Image Decoding:** Centralized the Odoo double-encoding base64 decoder in `imageUtils.js` and applied it natively to all image generation and lazy-fetching hooks.
- **Infinite Spinner Fix:** Modified `useAuditWizard` to iterate over array fields for `pendingFetch` images instead of only checking top-level image fields.
- **Observation Lines:** Mapped incoming `observationLines` (`name` field) from the API response to the `obs_list` form state for both network and power audits.
- **Patch Stability:** Excluded `auditeeAuditor` details from the standard PATCH payload so signatures can upload independently without crashing the backend.
- **Image Caching:** Removed IndexedDB caching from `reportApiService.fetchLineImage` so lazy-loaded images unconditionally hit the network, ensuring no stale images are ever shown.
- **Venue Schema Refactor:** Converted `SYSTEM_DETAILS_SCHEMA` to strictly use `snake_case` keys matching the backend, fixing broken mappings in Venue Audit.
- **Venue Service Types:** Enforced `Number()` casting on all `node-counts` and `number` fields in `venueAuditService.js` to prevent string/int mismatch crashes in Odoo.
- **Authentication Unification & Reinstatement:** Removed all global mock auth (`mockFetch.js`) and audit local testing bypasses. Restored `<ProtectedRoute requireAuth={true}>` for `/audit/*` routes, real Odoo credentials against `erp.eduquity.com`, and dynamic `serverApiKey` lookup in `httpClient.js`.
- **Dynamic User Context:** Removed hardcoded user credentials (like "Yash" and `userId = 2`). `AuditDashboardPage` and `AuditProvider` now dynamically inherit the authenticated user object directly from `useAppContext()`.
- **Session Reload Stability:** Modified `AppContext.jsx` to treat the `"already login"` Odoo response during an app background refresh as a successful session validation, preventing the app from erroneously deleting local storage and locking the user out.
- **AuditContext Syntax & Fallback Fix:** Fixed missing `try` block error in `AuditContext.jsx` (`fetchAuditData`), and ensured dynamic fallback to `localStorage` (`loginData`) for `effectiveUserId` when `userId` prop is omitted.
- **Audit Auto-Save Refactor:** Replaced the 5-second inactivity auto-save timer in `useAuditWizard` with a mandatory navigation-triggered save (via "Save", "Submit & Next", "Previous", or accordion clicks). This prevents duplicate array items from being created in Odoo when users are actively typing out new dynamic lines.
- **Deep-Compare Dirty Check:** Implemented a `lastSavedDataRef` snapshot system in `useAuditWizard` to deeply compare the active form data against the last successfully PATCHed state, ensuring we don't spam the Odoo API with redundant saves.
- **Custom Question Schema Dynamic Alignment:** Updated static schemas (`networkAuditSchemas.js`, `powerAuditSchemas.js`) and dynamic schema generator (`schemaGenerator.js`) so custom questions match their section fields (`records` for Network, `evidence` for Power, and `phase` without `score` for Power Supply Transformer).
- **Save vs. Server Submit Flow:** Isolated local draft saving (`handleSaveCurrent`) from server submission (`handleSubmitSection`). Replaced "Save & Next" with "Submit & Next", added a submission warning confirmation modal, and introduced session-based `submittedSections` tracking to lock submitted sections in read-only mode.
- **Form Lock/Read-Only Integrity & Visual Banners:** Fixed a prop mismatch by passing `globalDisabled` instead of `isReadOnly` to `FormRenderer` in all wizards, removed image-field clickability exceptions in `FormRenderer.jsx` so submitted sections are strictly unclickable, and added prominent Read-Only warning banners at the top of wizard forms when sections are locked.
- **Audit Navigation UI Styling:** Redesigned the action buttons (Save, Submit & Next, Submit & Exit, Next) across all wizard components to have distinct, premium colors and hover states that better convey their actions.
- **Custom Question Schema Corrections & Network Custom Questions:** Updated `schemaGenerator.js`, `useAuditWizard.js`, and `networkAuditService.js` so network audit custom questions map correctly without crashing or dropping dynamic lines during PATCH operations.
- **Bifurcated API Support:** Refactored dynamic schema generators and service layers to handle bifurcated Odoo line models (`system_conf_lines`, `network_conf_lines`, `backup_device_lines`, `security_compliance_lines`).
- **Custom Question Component Routing Fix (`FormRenderer.jsx`):** Fixed component routing for specialized audit question sub-types (`network-security-question`, `network-question`, `power-question`, `power-photo-question`) so that custom components render their header badges, checklist labels, remarks cards, and evidence image uploads instead of being intercepted by generic `ObjectSection`.
- **Subsection Dropdown Auto-Snap & Scroll Styling (`SubsectionAccordion.jsx`):** Enhanced subsection navigation with smooth auto-scroll centering on active sections (`scrollIntoView`), added a `Section X of Y` counter pill, styled a visible custom scrollbar thumb, and restricted container max-height (`max-h-[42vh]`) to prevent off-screen overflow when read-only banners are displayed.
- **Venue & Power Report Venue Info Read-Only Cleanup:** Removed the `region` field from Power and Network venue info schemas (`NETWORK_VENUE_INFO_SCHEMA`, `POWER_VENUE_INFO_SCHEMA`) and enforced `readOnly: true` on all fields (`totalNoNetwork`, `totalNodes`, etc.).
- **Venue Audit Field Restrictions:** 
  - Set all Auditee & Auditor Information fields (`auditeeName`, `auditeeRole`, `auditeeContact`, `auditorName`, `auditorRole`, `auditorContact`) to `readOnly: true` in `VENUE_PERSONNEL_INFO_SCHEMA`.
  - Restricted Venue Location Details (`LOCATION_DETAILS_SCHEMA`) so only **`region`** and **`googleMapLocationStatus`** remain editable, locking all other location fields.
# App-Mobile Audit Application Architecture & Rules

This document provides persistent context for the App-Mobile React application, specifically focusing on the dynamic Audit forms (`Venue`, `Network`, `Power`). It is automatically read by the AI agent at the start of every new chat.

## System Architecture
- **Framework:** React + Vite + React Hook Form (using `mode: 'onBlur'` for performance).
- **Routing:** React Router DOM.
- **Styling:** Tailwind CSS + custom SVG icons.
- **Offline/Draft Storage:** IndexedDB (via `storageService.js`) is used instead of `localStorage` to handle gigabytes of base64 image strings and offline drafts without crashing the browser or hitting quota limits.

## API & Data Mapping Quirks (Critical)
- **Odoo Base64 Double Encoding:** The backend (Odoo) often double-encodes base64 image strings (which usually start with `LzlqLzRB...`). **Always** use the `decodeOdooImage` helper function from `src/components/audit/utils/imageUtils.js` when mapping images received from the API.
- **Lazy Loading Images:** Do not fetch all images on report initialization to prevent massive API payloads. List-based images (like device photos and equipment documents) should be initialized with `{ pendingFetch: true, odooId: item.id, isFromServer: true }` and lazy-loaded via `reportApiService.fetchLineImage` inside `useAuditWizard` when their specific subsection is active.
- **Read-Only Fields Patching:** When saving a section, ensure that read-only fields (like the Auditor/Auditee details in the `PersonnelInfo` tab, which map to the `auditeeAuditor` payload) are **excluded** from the standard `patchAuditSection` API call. Pushing them causes 400-level errors and infinite retries.
- **Signatures Mapping:** Signatures are routed directly to the `signatures` JSON object rather than the standard fields.
- **Observations:** The GET API returns `observationLines` as `{ id, name }`. This must be specifically mapped to `observation` in the `obs_list` numbered-text-list schema.
- **Strict Integer Casting:** Odoo's PostgreSQL backend crashes with 400 Bad Request if you send a string to an integer field. **Always** cast HTML `number` and `node-counts` inputs with `Number(val)` before sending them in a PATCH payload (e.g. inside `venueAuditService.js`).
- **Venue System Details Mapping:** The Venue Audit `systemDetails` PATCH payload expects strictly **camelCase** keys grouped into nested objects (e.g., `nodeDetails`, `processorDetails`, `osDetails`, `ramDetails`, etc.), *not* a flat snake_case list.
- **Image Caching Bypass:** We do not cache individual image items in `storageService` anymore. `reportApiService.fetchLineImage` unconditionally hits the network to guarantee the user sees the latest backend edits.
- **Unified Authentication:** The audit feature does not manage its own auth state or context. `httpClient.js` dynamically reads the main application's `serverApiKey` and `loginData` directly from `localStorage` on every request.
- **Live Server Proxy (Web Dev):** When testing on the web (Vite), requests to `/api` are automatically proxied to `https://erp.eduquity.com` to bypass CORS.
- **Wizard Route/Context Fallback:** Audit wizards (`VenueAuditWizard`, `NetworkAuditWizard`, `PowerAuditWizard`) pull `odooData` from `location.state` when navigating internally, with an automated fallback to searching `AuditContext` reports using `useParams()` (`reportId`) when refreshed or accessed via direct URL.
- **Network Security Compliance Mapping:** Security compliance questions map to `security_compliance_lines` (with fallbacks for `security_compliance` / `securityCompliance` payload keys) and support multiple backend attribute fallbacks (`category`/`head`/`section_name`, `remarks`/`description`/`evidence`/`findings`).
- **Read-Only Field Enforcements:** Auditor/Auditee information across all audit forms (`Venue`, `Network`, `Power`) and Auditor Name in Conclusion are strictly configured with `readOnly: true`.

## Recent Changes (July 2026)
- **Image Mapping:** Refactored `networkAuditService.js` and `powerAuditService.js` to correctly map dynamic arrays (`devicePhotos`, `equipmentDocuments`).
- **Image Decoding:** Centralized the Odoo double-encoding base64 decoder in `imageUtils.js` and applied it natively to all image generation and lazy-fetching hooks.
- **Infinite Spinner Fix:** Modified `useAuditWizard` to iterate over array fields for `pendingFetch` images instead of only checking top-level image fields.
- **Observation Lines:** Mapped incoming `observationLines` (`name` field) from the API response to the `obs_list` form state for both network and power audits.
- **Patch Stability:** Excluded `auditeeAuditor` details from the standard PATCH payload so signatures can upload independently without crashing the backend.
- **Image Caching:** Removed IndexedDB caching from `reportApiService.fetchLineImage` so lazy-loaded images unconditionally hit the network, ensuring no stale images are ever shown.
- **Venue Schema Refactor:** Converted `SYSTEM_DETAILS_SCHEMA` to strictly use `snake_case` keys matching the backend, fixing broken mappings in Venue Audit.
- **Venue Service Types:** Enforced `Number()` casting on all `node-counts` and `number` fields in `venueAuditService.js` to prevent string/int mismatch crashes in Odoo.
- **Authentication Unification & Reinstatement:** Removed all global mock auth (`mockFetch.js`) and audit local testing bypasses. Restored `<ProtectedRoute requireAuth={true}>` for `/audit/*` routes, real Odoo credentials against `erp.eduquity.com`, and dynamic `serverApiKey` lookup in `httpClient.js`.
- **Dynamic User Context:** Removed hardcoded user credentials (like "Yash" and `userId = 2`). `AuditDashboardPage` and `AuditProvider` now dynamically inherit the authenticated user object directly from `useAppContext()`.
- **Session Reload Stability:** Modified `AppContext.jsx` to treat the `"already login"` Odoo response during an app background refresh as a successful session validation, preventing the app from erroneously deleting local storage and locking the user out.
- **AuditContext Syntax & Fallback Fix:** Fixed missing `try` block error in `AuditContext.jsx` (`fetchAuditData`), and ensured dynamic fallback to `localStorage` (`loginData`) for `effectiveUserId` when `userId` prop is omitted.
- **Audit Auto-Save Refactor:** Replaced the 5-second inactivity auto-save timer in `useAuditWizard` with a mandatory navigation-triggered save (via "Save", "Submit & Next", "Previous", or accordion clicks). This prevents duplicate array items from being created in Odoo when users are actively typing out new dynamic lines.
- **Deep-Compare Dirty Check:** Implemented a `lastSavedDataRef` snapshot system in `useAuditWizard` to deeply compare the active form data against the last successfully PATCHed state, ensuring we don't spam the Odoo API with redundant saves.
- **Custom Question Schema Dynamic Alignment:** Updated static schemas (`networkAuditSchemas.js`, `powerAuditSchemas.js`) and dynamic schema generator (`schemaGenerator.js`) so custom questions match their section fields (`records` for Network, `evidence` for Power, and `phase` without `score` for Power Supply Transformer).
- **Save vs. Server Submit Flow:** Isolated local draft saving (`handleSaveCurrent`) from server submission (`handleSubmitSection`). Replaced "Save & Next" with "Submit & Next", added a submission warning confirmation modal, and introduced session-based `submittedSections` tracking to lock submitted sections in read-only mode.
- **Form Lock/Read-Only Integrity & Visual Banners:** Fixed a prop mismatch by passing `globalDisabled` instead of `isReadOnly` to `FormRenderer` in all wizards, removed image-field clickability exceptions in `FormRenderer.jsx` so submitted sections are strictly unclickable, and added prominent Read-Only warning banners at the top of wizard forms when sections are locked.
- **Audit Navigation UI Styling:** Redesigned the action buttons (Save, Submit & Next, Submit & Exit, Next) across all wizard components to have distinct, premium colors and hover states that better convey their actions.
- **Custom Question Schema Corrections & Network Custom Questions:** Updated `schemaGenerator.js`, `useAuditWizard.js`, and `networkAuditService.js` so network audit custom questions map correctly without crashing or dropping dynamic lines during PATCH operations.
- **Bifurcated API Support:** Refactored dynamic schema generators and service layers to handle bifurcated Odoo line models (`system_conf_lines`, `network_conf_lines`, `backup_device_lines`, `security_compliance_lines`).
- **Custom Question Component Routing Fix (`FormRenderer.jsx`):** Fixed component routing for specialized audit question sub-types (`network-security-question`, `network-question`, `power-question`, `power-photo-question`) so that custom components render their header badges, checklist labels, remarks cards, and evidence image uploads instead of being intercepted by generic `ObjectSection`.
- **Subsection Dropdown Auto-Snap & Scroll Styling (`SubsectionAccordion.jsx`):** Enhanced subsection navigation with smooth auto-scroll centering on active sections (`scrollIntoView`), added a `Section X of Y` counter pill, styled a visible custom scrollbar thumb, and restricted container max-height (`max-h-[42vh]`) to prevent off-screen overflow when read-only banners are displayed.
- **Venue & Power Report Venue Info Read-Only Cleanup:** Removed the `region` field from Power and Network venue info schemas (`NETWORK_VENUE_INFO_SCHEMA`, `POWER_VENUE_INFO_SCHEMA`) and enforced `readOnly: true` on all fields (`totalNoNetwork`, `totalNodes`, etc.).
- **Venue Audit Field Restrictions:** 
  - Set all Auditee & Auditor Information fields (`auditeeName`, `auditeeRole`, `auditeeContact`, `auditorName`, `auditorRole`, `auditorContact`) to `readOnly: true` in `VENUE_PERSONNEL_INFO_SCHEMA`.
  - Restricted Venue Location Details (`LOCATION_DETAILS_SCHEMA`) so only **`region`** and **`googleMapLocationStatus`** remain editable, locking all other location fields.
  - Set `auditorName` in Venue Conclusion (`CONCLUSION_SCHEMA`) to `readOnly: true`.
- **Venue Navigation Simplification:** Replaced `Submit & Next` and `Save` buttons with a simple **`Next`** button on early Venue Audit sections (`ReportInfo`, `PersonnelInfo`, `LocationDetails`), allowing smooth section transition without triggering section lock confirmation modals.
- **Remote Software Status Select Field:** Converted `remoteSoftwareFound` in Venue Audit (*Policies & Software*) from a text field to a selection dropdown with options **`Yes installed`** (`installed`) and **`Nothing Found`** (`not_found`).
- **Power Audit Section 10 Renaming & Equipment Document Image Fix:**
  - Renamed Section 10 in Power Audit (`PowerAuditWizard.jsx` & `powerAuditSchemas.js`) to **`13. Nameplate and Document of Equipments`** (`POWER_SECTION_10_SCHEMA` label: `Nameplate and Document of Equipments`).
  - Fixed `powerAuditService.js` initialization logic for `equipmentDocuments` to map incoming backend lines (`nameplateDocumentEquipmentLines`, `equipment_documents`, `documents`, etc.) into array state with `{ pendingFetch: true, odooId: item.id, isFromServer: true }` for lazy image fetching.
  - Updated `FormDocumentList.jsx` to normalize both `doc_name`/`doc_image` and `documentName`/`documentImage` keys and inherit `readOnly`/`disabled` props.
  - Updated `useAuditWizard.js` lazy image hook to check `item.doc_image`, `item.docImage`, and `item.documentImage` properties.
- **Venue Audit Administrative Details NA Removal:** Removed the 'NA' option (`yes-no-na` changed to `yes-no`) from four specific fields in the Administrative Details schema (`liftFacilityAvailable`, `groundFloorLabAvailable`, `airConditioningAdequate`, `emergencyExitEachFloor`) to align with backend expectations.
- **Settings Sync Queue UI:** Refactored the `AuditSettingsPage.jsx` pending sync count into a detailed, grouped accordion list. Users can now see exactly which reports and specific sections (e.g., "Updated Device Photos") are queued for offline synchronization.
- **Offline Network Error Handling & Draft Storage Persistence Fixes:**
  - Implemented `isNetworkOrServerError` in `reportApiService.js` to catch network disconnects (Wi-Fi off), Capacitor HTTP status 0 errors, fetch failures, native Java/Swift exceptions (`UnknownHostException`, `Unable to resolve host`, `ConnectException`, `SocketTimeoutException`, `NoRouteToHostException`), and server 5xx errors across Web and Native mobile platforms.
  - Assigned unique timestamped IDs to IndexedDB `sync_queue` tasks so multiple offline section patches for the same report are queued sequentially without overwriting each other.
  - Refactored `useAuditWizard.js` initialization to load and merge existing IndexedDB drafts (`{ ...initialFormValues, ...draftData }`), eliminating the bug where opening a report from the dashboard unconditionally overwrote local saves with raw server data.
  - Updated `handleSubmitSection` in `useAuditWizard.js` to trigger `handleSaveCurrent(true)` and update `submittedSections` when offline, guaranteeing local draft storage and section locking are updated alongside the sync queue.
  - Updated `venueAuditService.js` to execute all section, bifurcation, and signature patches via `Promise.all(promises)` so all offline sync tasks are queued together.
