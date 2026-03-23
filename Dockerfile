# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────────────────────
# - Vite builds the frontend
# - scripts/compress.mjs generates .br (Brotli) and .gz (Zopfli) variants
# - esbuild bundles the HonoJS server into a single dist/server.js
FROM deps AS build
COPY . .
RUN pnpm build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Only copy the self-contained build output — no node_modules needed
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
