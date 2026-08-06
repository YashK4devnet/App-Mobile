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
- **Auth Endpoint & Response Parsing Fix:** Corrected login API URL in `Auth.jsx` to use `/odoo_connect` (singular) to match Odoo backend and Vite proxy configuration. Normalized authentication status response parsing (case-insensitive checking of `Status`, `status`, and `message` properties alongside `api-key` validation) and handled JSON `"already login"` responses, preventing successful logins from displaying error messages. Cleaned up legacy test code blocks and debug logs.
- **Background Live Tracking Integration & Native HTTP Bypass:** 
  - Added `@capacitor-community/background-geolocation` and implemented interval-based (5s) background tracking for attendance, leveraging an Android foreground service with custom `AndroidManifest.xml` permissions (`ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION`).
  - **WebView Suspension Bypass:** Because Android OS forcefully suspends the Capacitor JavaScript thread (WebView) after 1-5 minutes when the screen is locked, standard JS `fetch` calls failed to send background locations. We solved this completely natively.
  - **Native Broadcast Receiver (`NativeTrackingPlugin.java`):** Created a custom local Capacitor plugin directly inside the Android project. It registers a `BroadcastReceiver` in `MainActivity.java` to listen for the native GPS intent (`com.equimaps.capacitor_background_geolocation.broadcast`) fired by the community package.
  - **Native HTTP POST:** The Java receiver spawns a background thread and sends the HTTP POST directly to `/api/employee/location/log` using `HttpURLConnection`, natively bypassing the frozen JavaScript environment while preventing battery-draining CPU WakeLocks. It strictly sends `latitude` and `longitude` as native Doubles (not Strings) to prevent Odoo 400/404 schema validation errors.
  - **Config Sync & User ID Fix:** JavaScript (`LiveTracking.jsx`) dynamically parses the `loginData` JSON from local storage to strictly extract the `user_id` instead of the generic `employeeId` (which was accidentally mapping to `partner_id`). It securely passes this ID, the `serverApiKey`, the exact `endpointUrl` (preventing `/api` duplication), and a dynamic `interval` down to the `NativeTrackingPlugin` before starting tracking. (Note: ID is temporarily hardcoded to `1` for backend testing).
- **Vite Environment Modes Architecture:** Implemented a robust multi-environment configuration utilizing `.env.staging`, `.env.development`, and `.env.production`. Added a custom `build:staging` script (`vite build --mode staging`) to allow Capacitor to build and sync local dev endpoint settings (like pointing to `192.168.x.x`) directly to the Android physical device testing environment without injecting dev flags into the production build.
- **Global API Endpoint Refactoring:** Replaced all hardcoded `https://erp.eduquity.com` string literals and template hooks across the application with dynamic `import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'` variables, guaranteeing seamless switching between local networks and production without manual code edits.
- **Development Environment Login Response Support & Reversion Guide:**
  - Updated `Auth.jsx`, `AppContext.jsx`, and `isValidSession.js` to normalize the dev environment login API response (`{ "status": "success", "message": "Authentication successful", "user": "...", "user_id": ..., "partner_id": ..., "api-key": "..." }`) while remaining 100% backwards compatible with legacy/production Odoo responses (`{ "Status": "auth successful", "User": "...", "UserID": ..., "employee_id": ... }`).
  - **Steps to Reverse (Revert to strict legacy Odoo response format):**
    1. In `src/components/Auth/Auth.jsx`:
       - Revert `isAuthSuccessful` check to: `const isAuthSuccessful = statusValue === "auth successful" || (hasApiKey && (responseData?.UserID || responseData?.employee_id));`.
       - Revert `userData` mapping to strictly use `responseData.User` for name, `responseData.UserID` for Id, and `responseData.employee_id` for employeeId without `user_id`/`partner_id`/`user` fallbacks.
    2. In `src/store/AppContext.jsx`:
       - Revert re-auth response parsing in `loadStoredData()` to extract only `responseData.employeeId`, `responseData.userId`, and `responseData["api-key"]`.
    3. In `src/utils/isValidSession.js`:
       - Revert `apiKey` extraction to strictly check: `const apiKey = parsedData["api-key"];`.
- **Vite Proxy & Local API Dev Server Fixes:**
  - Resolved local web CORS errors by modifying `vite.config.js` to dynamically override `import.meta.env.VITE_API_BASE_URL` to `/api` specifically when running the dev server (`command === 'serve'`), ensuring frontend requests are cleanly intercepted by Vite's proxy.
  - Added a strict, non-rewriting proxy rule for `/api/audits` in `vite.config.js` to prevent Vite from erroneously stripping the `/api` prefix, as the Odoo backend strictly requires it for audit routes (fixing 404 Not Found errors on local backend testing).
  - Fixed a header duplication bug in `httpClient.js` where both `api-key` and `api-Key` were being injected simultaneously. This caused browsers to merge them into a comma-separated string (e.g., `key1, key1`), resulting in backend validation failures.
  - Added `VITE_API_DB=odoo1234` to local `.env` files to prevent the app from defaulting to the production database and rejecting valid local API keys.

- **Vite Proxy Dynamic Base URL Setup:**
  - Removed the hardcoded `192.168.x.x` proxy address inside `vite.config.js`. 
  - The proxy now reads dynamically from `env.VITE_API_BASE_URL` with a fallback to the production URL, allowing Pinggy tunnels and local network IP setups to work interchangeably during WFH scenarios.
- **Audit "Not Started" State Decoupling:**
  - Decoupled `isAuditNotStarted` (triggered by `draft` or `assign_user`) from the strict `isReadOnly` state in `useAuditWizard`.
  - Upgraded Venue, Network, and Power audit wizards to dynamically show a blue "Audit Not Started" banner instead of the red "Read-Only" banner on brand-new reports.
  - Injected a glowing "Start Audit" CTA into the action footer to replace the "Next" button when a user bypasses the index and navigates straight to the form of an unstarted audit.
- **Global Background Tracking Automation (`liveTrackingService.js`):**
  - Refactored all background geolocation tracking out of `LiveTracking.jsx` into a headless singleton service (`src/services/liveTrackingService.js`).
  - `Auth.jsx` now correctly parses and persists `employee_id` and the `skip_location` boolean flag from the Odoo backend login response.
  - Upgraded `AppContext.jsx` to dynamically parse `skip_location`. If `true`, the strict `isWithinAllowedLocation` geofence logic is entirely skipped, allowing check-in/out from any distance.
  - Automated `liveTrackingService.startTracking()` to trigger on a successful `checkIn` and `liveTrackingService.stopTracking()` on `checkOut`, managing the foreground Android native service autonomously based on attendance state without requiring the test UI to be mounted.
- **Venue Audit Printers & Scanners Expansion:**
  - Added the `Mixed` (`mixed`) option to the `printerType` and `scannerType` dropdowns inside the Administrative Details section of `auditSchemas.js` to match backend expectations.
- **Production Preparation Cleanup:**
  - Removed all hardcoded `test/test` offline development auth bypasses from `Auth.jsx` to ensure strict production authentication.
  - Removed the `X-Pinggy-No-Screen` development proxy header from `httpClient.js`.
  - Updated `liveTrackingService.js` to strictly enforce a `15-minute` (900000ms) interval between background location posts.
  - Removed the `LiveTracking.jsx` test UI component from the `Attendance.jsx` screen, returning it to a production-ready check-in/out interface.
- **Signature Section Client Customization & Audit Fetch Optimization:**
  - Updated `networkAuditSchemas.js` and Venue `auditSchemas.js` to relabel `"Electrician Signature"` to **`Centre/Venue IT's Signature`** (`electricianSignature` schema key preserved for Odoo API compatibility).
  - Refactored `AuditContext.jsx` `fetchAuditData` logic so background refreshes do not trigger full-screen loading spinners.
- **UI & UX Modernization (Profile, Dashboard, Navbar & Auth):**
  - Redesigned styling and responsiveness across `Profile.jsx`, `Auth.jsx`, `Dashboard.jsx`, and `Navbar.jsx`.
  - Added modular SVG navigation icons in `NavbarIcons.jsx` and updated CSS modules (`Navbar.module.css`, `Profile.module.css`, `Dashboard.module.css`, `Auth.module.css`).
- **Production Cleaning & Attendance History Refactor:**
  - Cleaned up production auth handling in `Auth.jsx` and updated state rendering in `AttendanceHistory.jsx`.
- **Live Location Tracking Auto-Resume & Native Offline Queue:**
  - Added auto-restart logic in `AppContext.jsx` so background location tracking (`liveTrackingService.startTracking()`) automatically revives on app launch or server sync whenever an active check-in session is detected.
  - Implemented a native offline queue in `NativeTrackingPlugin.java` using Android `SharedPreferences`. When network connectivity drops or timeouts occur, location payloads (`latitude`, `longitude`, `date`, `time`, `employee_id`) are saved locally (up to 200 logs). Upon network restoration, the queue is automatically flushed and synced to Odoo sequentially.
  - Created native `stopTracking()` plugin method in `NativeTrackingPlugin.java` to clear `apiKey` and `employeeId` on check-out, ensuring orphan background watchers cannot execute location HTTP posts after check-out.
  - Created monochrome vector notification icon `ic_notification_location.xml` in `android/app/src/main/res/drawable/` and configured `capacitor_background_geolocation_notification_icon` (`drawable/ic_notification_location`) & `capacitor_background_geolocation_notification_color` (`#ff7700`) in `android/app/src/main/res/values/strings.xml`.
- **Matte Black & Orange Theme Modernization (Auth, Dashboard, Navbar, Profile, Attendance, Incident & Audit):**
  - Redesigned visual aesthetics across `Auth`, `Dashboard`, `Navbar`, `Profile`, `Attendance`, `Incident`, and all **`Audit`** components (`#08080a` obsidian background, `#ff7700` warm orange highlights, dark frosted glass cards `rgba(14, 14, 18, 0.88)`).
  - Configured Tailwind v4 `@theme` design tokens in `index.css` for `--color-obsidian-bg`, `--color-obsidian-card`, and `--color-brand-orange`.
  - Updated all Audit layouts, headers, bottom navigation (`BottomNav.jsx`), accordion lists (`SubsectionAccordion.jsx`), progress bars, filter pills, and form controls (`FormYesNoSelector`, `FormQualitySelector`, `FormRating10Scale`, `FormSignature`, etc.) from legacy deep blue (`#0F0F23`) and teal (`#4ECDC4`) to Matte Black & Warm Orange.
  - Eliminated all heavy neon/orange glows (`box-shadow`) from icons, badges, buttons, active nav pills, and cards for a clean, matte, high-end design.
- **Center Infrastructure Checklist Modernization:**
  - Converted `ExamDayReadinessChecklist.module.css`, `SealingChecklist.module.css`, `ShiftWiseChecklist.module.css`, `UnsealingChecklist.module.css`, and `ChecklistForm.module.css` from legacy dark colors to off-white (`#f8fafc`), dark slate (`#0f172a`), and warm orange (`#ff7700`) design tokens.
- **Splash Screen Center Alignment & Radial Animation:**
  - Updated `SplashScreen.jsx` and `SplashScreen.module.css` to dead-center the logo at 50%/50% (`transform: translate(-50%, -50%)`), matching Android's native splash screen bitmap. Moved text and spinner below logo, with layered animated radial orange background wave ripples.
- **Status Bar Overlay Setup:**
  - Changed `capacitor.config.json` SplashScreen `backgroundColor` to `#FFFFFF`. Added global `StatusBar.setOverlaysWebView({ overlay: true })` and `StatusBar.setStyle({ style: Style.Light })` in `App.jsx` and `Auth.jsx` to prevent top black bar glitches across non-navbar screens.
- **Signatures Section Restored Submission & Locking:**
  - Updated `useAuditWizard.js` to allow `PersonnelInfo` to be tracked in `submittedSections` and locked upon submission. Removed `PersonnelInfo` from Next-only bypass lists in Venue, Network, and Power audit wizards so Save and Submit & Next buttons render and post signature payloads to Odoo.
- **Audit Index Padding & Floating Start Audit Button Removal:**
  - Removed floating `isAuditNotStarted` "Start Audit" button overlay from `renderIndexView` in `VenueAuditWizard.jsx`, `NetworkAuditWizard.jsx`, and `PowerAuditWizard.jsx`. Rendered Start Audit button directly inside form view action footer in warm orange (`#ff7700`).
  - Added `pb-28` to `AuditIndex.jsx` scroll container and `pb-32` to wizard form content containers so section cards and form inputs scroll cleanly above bottom navigation and action footers without clipping.
- **Logout & Background Tracking Notification Removal:**
  - Added `bg_watcher_id` persistence in `localStorage` inside `liveTrackingService.js`. When `stopTracking()` or `logout()` runs, `liveTrackingService` removes the background geolocation watcher (`BackgroundGeolocation.removeWatcher({ id })`) and clears native tracking config (`NativeTracking.stopTracking()`), immediately terminating the foreground service notification on logout without requiring an app force-close.
- **Check-Out Immediate Location Update:**
  - Added `sendFinalCheckoutLocation()` to `liveTrackingService.js`. Captured high-accuracy GPS position (`latitude`, `longitude`, `date`, `time`, `employee_id`) and sent an immediate POST update to `/api/employee/location/log` upon Check-Out in `AppContext.jsx` before shutting down background tracking.
- **Attendance Record Sorting & Check-In Server Sync:**
  - Updated `Attendance.jsx` to sort `data.records` descending by ID (`att_id`/`id`) before picking `latestRecord`, ensuring `fetchAttendanceStatus()` always processes the newest check-in activity instead of an old record.
  - Updated `syncCheckInFromServer(checkInTime)` call in `Attendance.jsx` to explicitly pass the parsed server timestamp, updating `AppContext` state and `localStorage` so server data properly overwrites local draft storage on fetch.
  - Updated `setConfig` in `NativeTrackingPlugin.java` to reset `lastPostTime = 0` whenever tracking starts, ensuring manual check-in location pings bypass the 15-minute throttle interval immediately.



