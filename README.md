# Fantasy Football Platform (Vite + React + TypeScript)

This project is now powered by [Vite](https://vitejs.dev/) for lightning-fast development and optimized builds.

## Project Structure

```
public/           # Static assets (index.html, metadata.json, etc.)
src/              # All source code
  components/     # React components
  context/        # React context providers
  services/       # API and utility services
  types.ts        # TypeScript types
tsconfig.json     # TypeScript config
vite.config.ts    # Vite config
```

## Getting Started

**Prerequisites:** Node.js (v18+ recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set environment variables:**
   - Create a `.env.local` file in the project root.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_key_here
     ```
3. **Run the app in development mode:**
   ```bash
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173) by default.

4. **Build for production:**
   ```bash
   npm run build
   ```
   - Preview the production build:
     ```bash
     npm run preview
     ```

## Notes
- **Static assets**: Place any files you want to be publicly available (e.g., `metadata.json`, images) in the `public/` folder.
- **TypeScript**: Fully supported and configured for Vite. Source code is in `src/`.
- **Fast Refresh**: Vite provides instant hot module replacement (HMR) for React components.
- **Optimized Imports**: All imports use the `@/` alias for cleaner paths (see `vite.config.ts` and `tsconfig.json`).
- **Tailwind CSS**: Configured via CDN in `public/index.html`. For advanced usage, consider installing Tailwind as a PostCSS plugin.

## Troubleshooting
- If you see import errors, ensure all paths use the `@/` alias and files are in the correct folders.
- If you add new static files, restart the dev server to ensure Vite picks them up.
- For issues with environment variables, check your `.env.local` and restart the dev server.

## Migrated from Custom Build to Vite
- All custom build scripts have been replaced by Vite's dev/build/preview commands.
- Source files are now organized under `src/` for best practices.
- Static assets are served from `public/`.

## Learn More
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
