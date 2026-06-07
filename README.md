# Fast Text — Instant Anonymous File Sharing

![Built with Vite](https://img.shields.io/badge/built%20with-Vite-yellow?style=for-the-badge&logo=vite)

Fast Text is a web-based platform designed for instant, anonymous sharing of text, images, and various file types. The application focuses on simplicity with no sign-ups or user tracking required. All shared content is automatically deleted, and users can simply paste, drop, or upload their files to generate a shareable code instantly.

The project is built as a modern React + Vite + TypeScript application, featuring Tailwind CSS and shadcn/ui components for a sleek and responsive user interface.

## Features

- **Instant Anonymous Sharing:** Share text, images, and files without creating an account.
- **Auto-Deletion:** Content automatically deletes, ensuring privacy.
- **Simple Share Code Generation:** Get a code instantly for sharing text or code snippets.
- **Multiple File Support:** Drop or upload images, GIFs, stickers, and any other file types up to 10MB.
- **Text & Code Area:** Dedicated space for pasting text, code, or markdown with syntax highlighting, and easy copying.
- **Testing & E2E:** Unit tests with Vitest and Playwright configuration for end-to-end tests.
- **Deployment Ready:** Static build with `vite build` for hosting on platforms like Vercel, Netlify, or GitHub Pages.

## Quick Start

---

### Prerequisites

- Node.js 18+ and npm installed

### Install

```bash
cd FAST-TEXT.IO
npm install
```

### Run (development)

```bash
npm run dev
# open http://localhost:8080/
```

### Build (production)

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test
npm run test:watch
```

## Environment Variables

---

Create a `.env` file at the project root with the necessary configuration keys. Common variables might include:

- `VITE_SUPABASE_URL` (if Supabase is used for backend services)
- `VITE_SUPABASE_ANON_KEY`

Make sure not to commit secrets to source control. A `.env` placeholder exists in the repository — replace values locally.

## Project Structure (high level)

---

The high-level project structure is:

- `src/` — React app source, components, and pages (`src/main.tsx`, `src/App.tsx`).
- `src/components/` — UI and file handling components.
- `src/pages/` — Top-level page components (`Index`, `ViewText`, `ViewImage`, `ViewFile`).
- `src/lib/` — Utility functions and helpers (`storage.ts`, `idgen.ts`, `utils.ts`).
- `public/` — Static public assets.
- `docs/` — Static deploy artifacts (used for GitHub Pages or demos).
- Configuration files (`vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `eslint.config.js`, etc.).
- Testing configuration (`vitest.config.ts`).

## Deployment

---

Static hosts (Vercel / Netlify / GitHub Pages) are supported. Use:

- Build command: `npm run build`
- Publish directory: `dist`

Tip: Run `npm run preview` locally to verify the production build.

## Contributing

---

1. Fork or branch from `master`.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Make changes, add tests, and run `npm run test`.
4. Commit and push, then open a Pull Request.

Commit example

```bash
git add .
git commit -m "feat: add short description"
git push origin HEAD
```

## Troubleshooting

---

- If `npm run dev` fails on Windows PowerShell due to execution policy, use `npm.cmd run dev` or run the project in a Node-enabled shell.
- If a dependency is missing, run `npm install` to install packages.
- Check browser devtools (F12) → Console/Network for runtime errors.

## License

---

This repository does not include a license file by default. Suggested: MIT. Add a `LICENSE` file with your preferred license.

## Contact

---

- **Maintainer:** [shashidharashadapu348@gmail.com](mailto:shashidharashadapu348@gmail.com)
- **Repository:** [https://github.com/shashidharashadapu348-hub/FAST-TEXT.IO](https://github.com/shashidharashadapu348-hub/FAST-TEXT.IO)
