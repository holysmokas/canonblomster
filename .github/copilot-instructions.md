## Quick orientation

This repo is a small static website (HTML/CSS/JS) with an admin UI. Key locations:

- Root HTML pages: `index.html`, `admin-dashboard.html`, `admin-login.html`, `botanisk.html`, `kurater.html`
- Client JS: `scripts/` (notably `scripts/firebase.js` and `scripts/main.js`)
- Styles: `styles/` (e.g. `main.css`, `admin-dashboard.css`, `kurater.css`)
- Images: `images/`
- Metadata: `package.json`, `README.md`

## Big-picture architecture (what you'll need to know)

- The site is static and served as plain HTML/CSS/JS (no build pipeline). There is no server-side code in the repo.
- Two different admin data-flows exist and are important to distinguish:
  - Firestore-based flow: `scripts/firebase.js` initializes Firebase and exports `app, auth, db`. `scripts/main.js` (the admin logic) listens to and mutates a Firestore collection named `products` (uses `addDoc`, `deleteDoc`, `onSnapshot`). See `scripts/firebase.js` and `scripts/main.js` for examples.
  - Google Sheets + Apps Script flow: `admin-dashboard.html` posts product payloads to a Google Apps Script `SCRIPT_URL` and reads a CSV export of a Google Sheet (`SHEET_CSV_URL`) to display products. The HTML contains comments: "⚠️ UPDATE THESE URLs" — these endpoints are external dependencies and must be configured before use.

Important: these two flows are both present in the repo and are not yet unified. Before changing product CRUD code, determine which backend is the source of truth.

## Project-specific conventions and gotchas

- Files live at the repository root (HTML/CSS/JS) — despite README/package.json mentioning a `src/` layout. The README is generic/outdated.
- `package.json` contains a `start` script: `live-server src`. That will fail in the current tree because files are at the repo root. Recommended quick fixes:
  - run a dev server from the repo root (example):
    ```bash
    npx live-server .
    ```
  - or update `package.json` to: `"start": "live-server ."`.
- JavaScript module imports are used (ES modules + CDN). HTML pages use `<script type="module">` and import the Firebase CDN and local modules. Keep that module context when editing or running.
- The project language is Danish in the UI; keep strings and UX in Danish unless asked to internationalize.

## Integration points & secrets

- Firebase config (API keys) is present in `scripts/firebase.js`. It uses the public web API key and initializes `getAuth()` and `getFirestore()` — these are client-side and expected in the browser. Do not attempt to move secret server-side values into code without coordinating with the owner.
- External endpoints referenced in `admin-dashboard.html` (SCRIPT_URL and SHEET_CSV_URL) are critical; they control product creation and listing. They operate with `mode: 'no-cors'`, so responses are not observable; code assumes success and reloads the sheet/CSV.

## Concrete examples to reference

- Auth guard (client redirect to login): in `admin-dashboard.html` and `scripts/main.js` both call `onAuthStateChanged(auth, ...)` and redirect to `admin-login.html` when unauthenticated.
- Firestore usage example (from `scripts/main.js`): `onSnapshot(collection(db, 'products'), renderProducts)` and `await addDoc(collection(db, 'products'), { name, description, image, createdAt: new Date() })`.
- Google Sheets flow (from `admin-dashboard.html`): POST product as JSON to `SCRIPT_URL` and read `SHEET_CSV_URL` to render rows.

## Recommended first tasks for an AI contributor

1. Confirm which product backend to maintain (Firestore vs Google Sheets). Poke the owner or check deployment.
2. Fix module import paths and duplicate imports in `scripts/main.js` (there are repeated/incorrect imports at the top of the file). Prefer consistent imports like:
   ```js
   import { db, auth } from './scripts/firebase.js';
   import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
   ```
3. Adjust `package.json` start script to serve the repository root (or document how you started the site) so local dev is reproducible.

## Developer workflow / quick-run

No build step. To preview locally:

```bash
# from repo root
npx live-server .
# or update package.json then: npm start
```

## Tests / linters

There are no test suites or linter configurations in the repository. Changes should be manually verified in the browser and by confirming Firebase/Google Sheets interactions work with the configured endpoints.

## If you need more context

- Ask for the deployed Google Apps Script `SCRIPT_URL` and the Google Sheet CSV URL or the Firestore rules/account intended for use.
- If you want me to, I can open `scripts/main.js` and propose a patch to fix the broken/duplicate imports and make the start script change in `package.json`.

---
If any section is unclear or you'd like the instructions to be more/less prescriptive, tell me what to adjust and I will iterate. 
