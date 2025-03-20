FROM node:20-alpine AS builder
 
RUN corepack enable && corepack prepare pnpm@latest --activate
 
WORKDIR /app
 
COPY package.json pnpm-lock.yaml ./
 
RUN pnpm install --frozen-lockfile
 
COPY . .
 
RUN pnpm build
 
FROM node:20-alpine AS runner
 
WORKDIR /app
 
COPY --from=builder /app/cache-handler.mjs .
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
 
EXPOSE 3000
 
CMD ["node", "server.js"]