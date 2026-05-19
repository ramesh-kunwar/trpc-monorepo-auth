FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# --- Prune the monorepo for this app ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @repo/api --docker

# --- Install dependencies ---
FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@repo/api

# --- Production image ---
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=installer --chown=appuser:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=appuser:nodejs /app/apps/api/package.json ./package.json

USER appuser

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/index.js"]
