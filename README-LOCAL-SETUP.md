# Dakshin Academy — local setup

## Install and run

Use Node.js 20.19+ (or a current compatible LTS version), then run from this folder:

```bash
npm install
npm run dev
```

This project uses the Base44 SDK for tutor and testimonial records. A plain Vite
server does not automatically start a Base44 backend. If you have the Base44 CLI
and the app is configured, run:

```bash
base44 dev
```

Otherwise configure the Base44 environment values in a local `.env` file,
especially `VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL` (and any other
values required by your Base44 app). Do not commit secrets or tokens.

## Page URLs

- `/success-stories`
- `/tutors`

Both routes are registered in `src/App.jsx` and linked in
`src/components/layout/Header.jsx`.
