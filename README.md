# Team Bookmarks

[![CI](https://github.com/slashgear/team-bookmarks/actions/workflows/ci.yml/badge.svg)](https://github.com/slashgear/team-bookmarks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://ghcr-badge.egpl.dev/slashgear/team-bookmarks/size)](https://github.com/slashgear/team-bookmarks/pkgs/container/team-bookmarks)

A lightweight open source web app to manage, share and version your team's bookmarks as a YAML file.

- **Accessible** — keyboard navigation, ARIA, Lighthouse accessibility score = 100
- **Lightweight** — main bundle < 20 KB, heavy dependencies lazy-loaded
- **Self-hosted** — single Docker image, no database, no auth

## Features

- Create folders and sub-folders of links
- Import a `.yml` bookmark file
- Export as **YAML** (for Git versioning), **NETSCAPE HTML** (browser import) or **JSON**
- All edits saved in `localStorage` — your work survives page reloads
- Example collection pre-loaded with [Slashgear's favorite tools](https://blog.slashgear.dev/tools/)

## Quick start

### Docker

```bash
docker run -p 3000:3000 ghcr.io/slashgear/team-bookmarks:latest
```

Then open [http://localhost:3000](http://localhost:3000).

### Docker Compose

```yaml
services:
  team-bookmarks:
    image: ghcr.io/slashgear/team-bookmarks:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
docker compose up -d
```

## YAML format

```yaml
name: My Team
folders:
  - name: Dev Tools
    links:
      - label: GitHub
        url: https://github.com
    folders:
      - name: Monitoring
        links:
          - label: Grafana
            url: https://grafana.com
```

Save this file in your repository and import it whenever you need to update your team's bookmarks.

## Workflow

```
Edit in browser  →  Export .yml  →  Commit to Git  →  Share with team
                                         ↓
                               Anyone can re-import,
                               edit and export again
```

## Tech stack

| Layer       | Technology                                                 |
| ----------- | ---------------------------------------------------------- |
| Frontend    | [Preact](https://preactjs.com) + TypeScript                |
| Validation  | [Zod mini](https://zod.dev)                                |
| YAML        | [js-yaml](https://github.com/nodeca/js-yaml) (lazy-loaded) |
| Server      | [HonoJS](https://hono.dev) on Node 22                      |
| Compression | Brotli (q11) + [Zopfli](https://github.com/google/zopfli)  |
| Build       | [Vite](https://vite.dev)                                   |
| Tests       | [Vitest](https://vitest.dev)                               |
| Linting     | [Oxlint](https://oxc.rs/docs/guide/usage/linter)           |
| Formatting  | [oxfmt](https://github.com/nicolo-ribaudo/oxfmt)           |
| Releases    | [Changesets](https://github.com/changesets/changesets)     |

## Local development

### Requirements

- Node.js 22+
- pnpm 10+

### Setup

```bash
git clone https://github.com/slashgear/team-bookmarks.git
cd team-bookmarks
pnpm install
pnpm dev
```

### Available scripts

| Script               | Description                               |
| -------------------- | ----------------------------------------- |
| `pnpm dev`           | Start dev server                          |
| `pnpm build`         | Build frontend + compress + bundle server |
| `pnpm build:analyze` | Build with bundle visualizer              |
| `pnpm preview`       | Serve production build locally            |
| `pnpm test`          | Run tests in watch mode                   |
| `pnpm test:run`      | Run tests once                            |
| `pnpm lint`          | Lint with Oxlint                          |
| `pnpm format`        | Format with oxfmt                         |

### Build your own Docker image

```bash
docker build -t team-bookmarks .
docker run -p 3000:3000 team-bookmarks
```

## Deployment guides

- [Scaleway Serverless Containers](docs/deploy-scaleway.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © [Antoine Caron](https://blog.slashgear.dev)
