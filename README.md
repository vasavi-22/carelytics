# Carelytics (B2B Healthcare SaaS UI)

This project is a front-end UI demo for a B2B healthcare SaaS platform. It showcases:

- React + TypeScript
- Vite dev/build tooling
- React Router-based page composition
- State management via Context API (Auth state)
- Firebase Authentication (Google Sign-In) for Login + session handling
- A scalable folder structure designed for micro-frontend-style module separation

## Implemented so far

1. **Page scaffolding (UI)**
   - `/login` → `LoginPage`
   - `/` → `DashboardPage`
   - `/analytics` → `AnalyticsPage`
   - `/patients/:patientId` → `PatientDetailsPage`

2. **Authentication (Step 1)**
   - Firebase Authentication configured through Vite env vars
   - Login flow with:
     - Google Sign-In popup
     - Firebase error mapping to user-friendly messages
     - loading/disabled submit state
   - Session handling using `onAuthStateChanged` so protected routes unlock automatically after login
   - Route protection:
     - Dashboard, Analytics, and Patient Details are wrapped in `RequireAuth`

## Tech used

- **Frontend**: React, TypeScript, React Router
- **Build tool**: Vite
- **Auth**: Firebase Authentication (`firebase/auth`)
- **State management**: Context API (`AuthProvider`)

## Folder structure (module-oriented)

Key directories:

- `src/pages/`  
  Route-level page components:
  - `LoginPage.tsx`
  - `DashboardPage.tsx`
  - `AnalyticsPage.tsx`
  - `PatientDetailsPage.tsx`

- `src/components/layout/`  
  Shared layout (acts like a micro-frontend shell for protected pages):
  - `AppShell.tsx` (sidebar + outlet)

- `src/features/auth/`  
  Auth feature module:
  - `AuthContext.tsx` (session + sign-in/out APIs)
  - `RequireAuth.tsx` (route guard)
  - `types.ts` (small auth-related types)

- `src/integrations/firebase/`  
  Firebase integration module:
  - `firebaseConfig.ts` (env var validation)
  - `firebaseClient.ts` (singleton `initializeApp` + `getAuth`)

- `src/styles/`  
  Global UI styling:
  - `global.css`

This structure makes it straightforward to add the remaining modules later (analytics, patients, notifications, etc.) without turning the codebase into a monolith.

## Firebase setup (required)

1. Create a Firebase project
2. In the Firebase Console:
   - Enable **Authentication** → **Sign-in method** → **Google**
   - Configure your OAuth consent screen and authorized domains as Firebase prompts
3. Add these environment variables to your local environment:

Create `.env` (copy from `.env.example`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

### Current local setup in this repository

- `.env.example` contains working Firebase keys for the current `carelytics-dev` project.
- `.env` has been created by copying values from `.env.example` as-is.
- If you use your own Firebase project, replace all `VITE_FIREBASE_*` values in `.env`.

## Run locally

```bash
npm install
npm run dev
```

Then open the app and log in at `http://localhost:<port>/login`.

After authentication, you’ll be redirected and protected routes will render inside `AppShell`.

## Next steps (planned remainder of the challenge)

- **Patient Details module**: grid/list toggle with responsive UI (`Grid View` and `List View`)
- **Notifications**: Service Worker with a working notification demo (push or local)
- **Analytics**: real data flow wiring for analytics panels (and later performance improvements)
- **State management expansion**: extend Context/reducers for analytics + patient data flow

