# Contributing to Team Bookmarks

Thank you for your interest in contributing! Here's everything you need to get started.

## Local setup

### Requirements

- Node.js 22+
- pnpm 10+

### Fork and clone

```bash
git clone https://github.com/<your-fork>/team-bookmarks.git
cd team-bookmarks
pnpm install
pnpm dev
```

## Development workflow

1. **Create a branch** from `main`

   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes** — keep them focused and minimal

3. **Check your work** before opening a PR

   ```bash
   pnpm format       # auto-format
   pnpm lint         # lint check
   pnpm test:run     # run all tests
   pnpm build        # verify the full build passes
   ```

4. **Add a changeset** to describe your change

   ```bash
   pnpm changeset
   ```

   Choose the bump type:
   - `patch` — bug fix or small improvement
   - `minor` — new feature, backwards compatible
   - `major` — breaking change

5. **Open a pull request** against `main`

## Code conventions

- **TypeScript strict mode** — no `any`, no implicit types
- **Formatting** — enforced by oxfmt, runs automatically in CI
- **Linting** — enforced by Oxlint, fix with `pnpm lint`
- **Tests** — every new service or utility should have Vitest unit tests
- **Bundle size** — the main bundle must stay under 20 KB gzipped; heavy deps must be lazy-loaded
- **Accessibility** — Lighthouse accessibility score must remain at 100

## Project structure

```
src/
├── components/     Preact UI components
├── hooks/          Stateful hooks (useBookmarks)
├── services/       Domain services (yaml, export, storage)
├── utils/          Pure utilities (tree, download, preload)
└── types.ts        Shared TypeScript types

server/
└── index.ts        HonoJS static server

scripts/
└── compress.mjs    Post-build Brotli + Zopfli compression
```

## Opening an issue

- **Bug?** Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- **Feature idea?** Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Please be respectful and welcoming to all contributors.
