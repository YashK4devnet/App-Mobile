# App-Mobile Audit Application Architecture & Rules

This document provides persistent context for the App-Mobile React application, specifically focusing on the dynamic Audit forms (`Venue`, `Network`, `Power`). It is automatically read by the AI agent at the start of every new chat.

## System Architecture
- **Framework:** React + Vite + React Hook Form (using `mode: 'onBlur'` for performance).
- **Routing:** React Router DOM.
- **Styling:** Tailwind CSS + custom SVG icons.
- **Offline/Draft Storage:** IndexedDB (via `storageService.js`) is used instead of `localStorage` to handle gigabytes of base64 image strings and offline drafts without crashing the browser or hitting quota limits.

## API & Data Mapping Quirks (Critical)
- **Odoo Base64 Double Encoding:** The backend (Odoo) often double-encodes base64 image strings (which usually start with `LzlqLzRB...`). **Always** use the `decodeOdooImage` helper function from `src/components/audit/utils/imageUtils.js` when mapping images received from the API.
- **Lazy Loading Images:** Do not fetch all images on report initialization to prevent massive API payloads. List-based images (like device photos) should be initialized with `{ pendingFetch: true, odooId: item.id, isFromServer: true }` and lazy-loaded via `reportApiService.fetchLineImage` inside `useAuditWizard` when their specific subsection is active.
- **Read-Only Fields Patching:** When saving a section, ensure that read-only fields (like the Auditor/Auditee details in the `PersonnelInfo` tab, which map to the `auditeeAuditor` payload) are **excluded** from the standard `patchAuditSection` API call. Pushing them causes 400-level errors and infinite retries.
- **Signatures Mapping:** Signatures are routed directly to the `signatures` JSON object rather than the standard fields.
- **Observations:** The GET API returns `observationLines` as `{ id, name }`. This must be specifically mapped to `observation` in the `obs_list` numbered-text-list schema.
- **Strict Integer Casting:** Odoo's PostgreSQL backend crashes with 400 Bad Request if you send a string to an integer field. **Always** cast HTML `number` and `node-counts` inputs with `Number(val)` before sending them in a PATCH payload (e.g. inside `venueAuditService.js`).
- **Venue System Details Mapping:** The Venue Audit `systemDetails` PATCH payload expects strictly **camelCase** keys grouped into nested objects (e.g., `nodeDetails`, `processorDetails`, `osDetails`, `ramDetails`, etc.), *not* a flat snake_case list.
- **Image Caching Bypass:** We do not cache individual image items in `storageService` anymore. `reportApiService.fetchLineImage` unconditionally hits the network to guarantee the user sees the latest backend edits.
- **Unified Authentication:** The audit feature does not manage its own auth state or context. `httpClient.js` dynamically reads the main application's `serverApiKey` and `loginData` directly from `localStorage` on every request.
- **Live Server Proxy (Web Dev):** When testing on the web (Vite), requests to `/api` are automatically proxied to `https://erp.eduquity.com` to bypass CORS.

## Recent Changes (July 2026)
- **Image Mapping:** Refactored `networkAuditService.js` and `powerAuditService.js` to correctly map dynamic arrays (`devicePhotos`, `equipmentDocuments`).
- **Image Decoding:** Centralized the Odoo double-encoding base64 decoder in `imageUtils.js` and applied it natively to all image generation and lazy-fetching hooks.
- **Infinite Spinner Fix:** Modified `useAuditWizard` to iterate over array fields for `pendingFetch` images instead of only checking top-level image fields.
- **Observation Lines:** Mapped incoming `observationLines` (`name` field) from the API response to the `obs_list` form state for both network and power audits.
- **Patch Stability:** Excluded `auditeeAuditor` details from the standard PATCH payload so signatures can upload independently without crashing the backend.
- **Image Caching:** Removed IndexedDB caching from `reportApiService.fetchLineImage` so lazy-loaded images unconditionally hit the network, ensuring no stale images are ever shown.
- **Venue Schema Refactor:** Converted `SYSTEM_DETAILS_SCHEMA` to strictly use `snake_case` keys matching the backend, fixing broken mappings in Venue Audit.
- **Venue Service Types:** Enforced `Number()` casting on all `node-counts` and `number` fields in `venueAuditService.js` to prevent string/int mismatch crashes in Odoo.
- **Authentication Unification:** Removed all global mock auth (`mockFetch.js`) and audit "silent login" bypasses. The entire application now strictly uses real Odoo credentials against the live server (`erp.eduquity.com`).
