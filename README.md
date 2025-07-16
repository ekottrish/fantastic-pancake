# Fantasy Football Platform – Vite Edition

This project has been migrated to the **[Vite](https://vitejs.dev/)** build framework for lightning-fast development and optimized production bundles.

---

## ✨ Key advantages of the new setup

* Instant server start and on-demand module loading (no more long webpack waits!)
* Automatic React Fast Refresh for a smooth DX.
* Simplified folder structure – all source lives in `src/`.
* TypeScript and alias (`@/…`) fully configured out of the box.

---

## 📂 Project structure

```
.
├─ public/              # Static assets (served as-is)
├─ src/
│  ├─ components/       # React UI & pages
│  ├─ context/          # React Context providers
│  ├─ assets/           # Images, fonts, etc. (importable in TSX)
│  ├─ main.tsx          # Vite entrypoint (formerly index.tsx)
│  ├─ App.tsx           # Application router/layout
│  ├─ constants.ts      # Shared constants
│  ├─ supabaseClient.ts # Supabase SDK
│  ├─ types.ts          # Shared TypeScript types
│  └─ …
├─ index.html           # Single-page entry (handled by Vite)
├─ vite.config.ts       # Vite configuration
└─ tsconfig.json        # TypeScript configuration
```

> Note: Vite serves everything under **`public/`** at the site root. Place any static assets you reference by URL (e.g. `/logo.png`) there.

---

## 🛠  Development

```bash
# 1. Install dependencies
npm install

# 2. Specify your environment variables (example)
cp .env.example .env.local  # then edit values

# 3. Start the dev server 🚀
npm run dev
```

The app is now running at http://localhost:5173 with hot-module reload.

---

## 🏗  Production build

```bash
npm run build   # Bundles files into ./dist
npm run preview # Local preview of the production build
```

---

## ⚠️  Compatibility notes

* All dependencies bundled via **npm**. The former `<script type="importmap">` block has been removed.
* Tailwind is still loaded via CDN for brevity. For full tree-shakeable builds, integrate Tailwind/PostCSS.
* If any library relies on Node-specific APIs in the browser, Vite may warn at build time; use [vite-plugin-node-polyfills](https://github.com) or switch to browser-friendly packages.

---

## 🔍  Environment variables

| Variable             | Where it’s used | Notes                         |
|----------------------|-----------------|-------------------------------|
| `GEMINI_API_KEY`     | Client side     | Provide your Gemini key       |
| `VITE_SUPABASE_URL`  | Client side     | Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Client side | Supabase anon key             |

Add them to `.env.local` (this file is git-ignored). Prefix with `VITE_` for client exposure.

---

## 🙏  Acknowledgements

Migrated with ❤️ using Vite 6 + React 19.
