# Reality Hits App Audit

Date: 2026-05-12

Scope: backend, frontend, root configuration, dependency/build signals, and obvious silent-break risks.

## Audit Status

- [x] Repository inventory started
- [ ] Backend files reviewed
- [ ] Frontend files reviewed
- [ ] Config and documentation consistency reviewed
- [ ] Build/test/dependency checks run
- [ ] Final risk summary completed

## Working Notes

- Existing uncommitted changes were present before this audit:
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/pages/Home.jsx`
  - `frontend/src/pages/Login.jsx`
  - `frontend/src/services/api.js`
  - `backend/pyproject.toml` was untracked
- This audit intentionally avoids changing app code. Only `audit.md` is being edited.

## Repository Inventory

Root files:

- `package.json`
- `docker-compose.yml`
- `README.md`
- `GETTING_STARTED.md`
- `QUICKSTART.md`
- `DEPLOYMENT.md`
- `API_DOCS.md`
- `ARCHITECTURE.md`
- `PROJECT_STRUCTURE.md`
- `OVERVIEW.md`
- `PROJECT_COMPLETE.md`
- `INVENTORY.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `setup.sh`
- `setup.bat`
- `verify.sh`

Backend files:

- `backend/main.py`
- `backend/config.py`
- `backend/utils.py`
- `backend/test_lm_studio.py`
- `backend/requirements.txt`
- `backend/pyproject.toml`
- `backend/Dockerfile`
- `backend/__init__.py`
- `backend/database/__init__.py`
- `backend/database/mongo.py`
- `backend/middleware/__init__.py`
- `backend/models/__init__.py`
- `backend/models/schemas.py`
- `backend/routes/__init__.py`
- `backend/routes/admin.py`
- `backend/routes/auth.py`
- `backend/routes/complaints.py`
- `backend/routes/dashboard.py`
- `backend/services/__init__.py`
- `backend/services/ai_service.py`
- `backend/services/auth_service.py`
- `backend/services/complaint_service.py`
- `backend/services/department_config.py`
- `backend/services/forwarding_service.py`

Frontend files:

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/vite.config.js`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/index.html`
- `frontend/Dockerfile`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/index.css`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/api.js`
- `frontend/src/hooks/useToast.js`
- `frontend/src/utils/constants.js`
- `frontend/src/utils/helpers.js`
- `frontend/src/components/AIAnalysisShowcase.jsx`
- `frontend/src/components/ComplaintFilter.jsx`
- `frontend/src/components/ComplaintTimeline.jsx`
- `frontend/src/components/ComplaintsList.jsx`
- `frontend/src/components/LoadingSpinner.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ParticleBackground.jsx`
- `frontend/src/components/PriorityBadge.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/SkeletonLoader.jsx`
- `frontend/src/components/StatCard.jsx`
- `frontend/src/components/StatusTimeline.jsx`
- `frontend/src/components/Toast.jsx`
- `frontend/src/pages/AdminComplaintDetails.jsx`
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/AdminLogin.jsx`
- `frontend/src/pages/ComplaintDetails.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Features.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Signup.jsx`
- `frontend/src/pages/SubmitComplaint.jsx`
- `frontend/src/pages/TrackComplaint.jsx`
- `frontend/src/pages/UserDashboard.jsx`

## Findings

### Backend

1. **High: public endpoint exposes all complaint records**
   - File: `backend/routes/complaints.py:145`
   - `GET /api/complaints` returns all complaints without authentication. The serialized records include citizen name, email, phone, location, complaint text, admin notes, forwarding records, and email logs when present.
   - Risk: anyone can scrape personal complaint data. The authenticated admin list already exists at `GET /api/admin/complaints`.
   - Suggested fix: protect this route, remove it, or return only redacted public fields.

2. **High: hardcoded admin accounts and weak default credentials**
   - File: `backend/config.py:29`
   - Admin users are hardcoded with password `12345678` and are seeded on every startup.
   - Risk: predictable production admin access if deployed as-is. The seeding code can also reset existing admin passwords when the config password changes.
   - Suggested fix: move admin bootstrap credentials to environment variables, require strong one-time setup, and never ship real personal emails/default passwords.

3. **High: JWT has a production-looking default secret**
   - File: `backend/config.py:22`
   - `JWT_SECRET` falls back to a static string.
   - Risk: any deployment without a real secret has forgeable admin tokens.
   - Suggested fix: fail startup when `JWT_SECRET` is missing outside local development.

4. **Medium: CORS allows all origins while credentials are enabled**
   - File: `backend/main.py:29`
   - `allow_origins=["*"]` and `allow_credentials=True` are configured together.
   - Risk: this is too permissive for an admin API and may behave inconsistently in browsers. It also broadens cross-origin access to public endpoints.
   - Suggested fix: use explicit frontend origins from environment.

5. **Medium: startup can fail if the process starts outside the backend directory**
   - File: `backend/main.py:37`
   - Static files are mounted from relative path `uploads`. `backend/routes/complaints.py:13` also creates `uploads` relative to the current working directory.
   - Risk: `uvicorn backend.main:app` from repo root and `uvicorn main:app` from `backend/` can use different upload directories. If `uploads` does not exist before `app.mount`, startup can fail.
   - Suggested fix: derive an absolute upload path from `Path(__file__).parent`.

6. **Medium: complaint ID generation is race-prone**
   - File: `backend/services/complaint_service.py:11`
   - IDs are generated from `count_documents({}) + 1`.
   - Risk: simultaneous submissions can receive the same `CV-YYYY-XXXXXX` ID. There is no unique index shown to catch it.
   - Suggested fix: use an atomic counter collection or a unique indexed field with retry logic.

7. **Medium: uploaded files are not validated**
   - File: `backend/routes/complaints.py:59`
   - The API writes uploaded files using the original filename suffix without checking content type, extension, size, or path safety.
   - Risk: oversized files can consume disk; unsafe names can produce odd paths; non-image files can be hosted from `/uploads`.
   - Suggested fix: enforce max size, allowed MIME/extensions, generate safe filenames, and consider storing outside the web root.

8. **Medium: public tracking by email or phone discloses multiple complaints**
   - File: `backend/routes/complaints.py:151`
   - The track endpoint returns up to 20 complaints for an email or phone with no secondary verification.
   - Risk: guessing an email or phone exposes complaint history and personal details.
   - Suggested fix: require complaint ID plus contact match, or send a verification code before listing records.

9. **Medium: admin update accepts arbitrary status/priority/department**
   - File: `backend/routes/admin.py:40`
   - `STATUSES` exists but is not used for validation.
   - Risk: typos silently fragment status analytics and frontend display states.
   - Suggested fix: validate values against known enums before writing.

10. **Low: generated email body references the wrong citizen field**
    - File: `backend/services/forwarding_service.py:27`
    - Complaint records store `citizen_email`, but forwarding email HTML reads `email`.
    - Risk: forwarded audit email says `Anonymous` even for identified complainants.
    - Suggested fix: read `citizen_email` and/or `citizen_name`.

11. **Low: schemas are stale relative to persisted complaint data**
    - File: `backend/models/schemas.py:41`
    - The `Complaint` schema includes `email` and `mobile`, but current submission records use `citizen_email`, `citizen_phone`, and `citizen_name`.
    - Risk: generated docs/type assumptions drift from real API payloads.
    - Suggested fix: update schemas or remove unused schemas if routes intentionally return raw serialized documents.

12. **Low: Gemini fallback likely uses an incompatible auth shape**
    - File: `backend/services/ai_service.py:183`
    - The code calls the Gemini OpenAI-compatible endpoint with `Authorization: Bearer ...`. Some Gemini API flows expect API-key based auth rather than bearer tokens.
    - Risk: fallback AI may silently never work and then default all complaints to manual review.
    - Suggested fix: verify the chosen Gemini endpoint/auth mode and add a health check endpoint or startup check.

13. **Low: simulated forwarding marks email as delivered**
    - File: `backend/services/forwarding_service.py:61`
    - `status` is set to `delivered` while `delivery_status` says SMTP is not configured.
    - Risk: dashboard/audit users may believe a real department email was sent.
    - Suggested fix: use `simulated` or `not_sent` unless SMTP is actually configured.

### Frontend

1. **High: default API URL points to a specific ngrok host**
   - File: `frontend/src/services/api.js:3`
   - If `VITE_API_URL` is missing, the app sends all requests to `https://chute-ruckus-reproduce.ngrok-free.dev`.
   - Risk: local/dev/production builds silently call someone else's stale tunnel or a dead host. This also bypasses the Vite proxy.
   - Suggested fix: default to same-origin or `http://localhost:8000` for local development, and require explicit `VITE_API_URL` for hosted builds.

2. **High: Docker runtime env does not update the built frontend API URL**
   - Files: `frontend/Dockerfile:10`, `docker-compose.yml:42`
   - Vite reads `VITE_API_URL` at build time. The Dockerfile runs `npm run build` before the compose `environment` value is available to the already-built static app.
   - Risk: the container can serve a bundle with the hardcoded ngrok fallback even though compose sets `VITE_API_URL`.
   - Suggested fix: pass `VITE_API_URL` as a Docker build arg/env before `npm run build`, or serve a runtime config file.

3. **High: uploaded evidence images use backend-relative URLs directly in the browser**
   - Files: `frontend/src/pages/TrackComplaint.jsx:202`, `frontend/src/pages/ComplaintDetails.jsx:187`, `frontend/src/pages/AdminComplaintDetails.jsx` evidence section
   - Backend returns image paths such as `/uploads/...`, and the frontend renders them directly.
   - Risk: in dev or static hosting, the browser requests `http://frontend-host/uploads/...` instead of the backend host, so evidence images silently break.
   - Suggested fix: add a helper that prefixes relative upload paths with the configured API origin.

4. **Medium: Vite proxy config rewrites `/api` away, but API calls already include `/api`**
   - Files: `frontend/vite.config.js:8`, `frontend/src/services/api.js:23`
   - The proxy rewrites `/api/complaints` to `/complaints`, but backend routes are registered under `/api/complaints`.
   - Risk: if the frontend ever switches to same-origin `/api` in dev, every proxied API call becomes a 404.
   - Suggested fix: remove the rewrite or change service paths consistently.

5. **Medium: stale user-auth pages call functions that no longer exist**
   - Files: `frontend/src/pages/Login.jsx:8`, `frontend/src/pages/Login.jsx:19`, `frontend/src/pages/Signup.jsx:8`, `frontend/src/pages/Signup.jsx:20`, `frontend/src/pages/UserDashboard.jsx:20`
   - `AuthContext` exposes `loginAdmin`, not `login`; `authService` exposes `adminLogin`, not `login` or `signup`; `complaintService` does not expose `getMyComplaints`.
   - Risk: if these pages are routed again, they fail at runtime. They also point to `/user/dashboard`, which is not currently registered in `App.jsx`.
   - Suggested fix: delete these dead pages or reimplement real citizen auth routes end to end.

6. **Medium: citizen tracking UI exposes full personal data and admin notes**
   - File: `frontend/src/pages/TrackComplaint.jsx:76`
   - The track view shows name, phone, email, original text, admin notes, and dispatch details for any successful ID/email/mobile lookup.
   - Risk: this compounds the backend tracking disclosure issue and makes accidental sharing more likely.
   - Suggested fix: show redacted citizen fields in public tracking unless the user passes stronger verification.

7. **Medium: public/admin dashboard split is confusing and routes overlap**
   - Files: `frontend/src/App.jsx:35`, `frontend/src/pages/Dashboard.jsx:23`, `frontend/src/services/api.js:24`
   - `/dashboard` is admin-protected in `App.jsx`, but `Dashboard.jsx` labels itself `PUBLIC ANALYTICS` and uses the public all-complaints API.
   - Risk: stale route intent makes future edits risky; if `/dashboard` is exposed publicly, it leaks complaint records through `getComplaints`.
   - Suggested fix: decide whether `Dashboard.jsx` is public analytics or an admin page. If public, remove complaint-level rows or use redacted API data.

8. **Low: submit form hides email but backend requires a valid email**
   - File: `frontend/src/pages/SubmitComplaint.jsx:41`
   - The UI no longer renders an email field but submits a generated `phone@citizen.local` placeholder when no email is present.
   - Risk: tracking-by-email and forwarding/audit data become fake; users cannot receive real email updates later.
   - Suggested fix: either restore optional/required email input or make backend email optional and do not fabricate contact data.

9. **Low: frontend constants and filters are stale**
   - Files: `frontend/src/utils/constants.js:3`, `frontend/src/components/ComplaintFilter.jsx:47`, `frontend/src/components/ComplaintsList.jsx:47`
   - These still reference `Escalated`, `Healthcare`, `Education`, `Public Safety`, and `Transportation`, while backend categories/statuses use different values such as `Under Review`, `Assigned`, `Closed`, `Safety`, and `Transport`.
   - Risk: filters and future imports silently miss real records.
   - Suggested fix: source categories/statuses from a shared backend endpoint or keep one canonical frontend constants file aligned with backend enums.

10. **Low: admin token persistence has no expiry handling in UI**
    - File: `frontend/src/context/AuthContext.jsx:11`
    - The UI restores any stored token/user without checking JWT expiry.
    - Risk: an expired token shows admin UI until API requests fail with 401; there is no interceptor logout path.
    - Suggested fix: decode/check expiry on restore or handle 401 globally by clearing auth and redirecting to login.

## Verification Log

Checks will be added as they are run.
