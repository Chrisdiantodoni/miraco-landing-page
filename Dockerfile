# 1. Base Image
FROM node:18-alpine AS base

# 2. Install Dependencies
FROM base AS deps
# libc6-compat diperlukan untuk beberapa library native di node (seperti sharp atau bcrypt)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfiles untuk install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Matikan telemetry jika tidak ingin mengirim data ke Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Jalankan build
RUN npm run build

# 4. Runner Stage (Produksi)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user system untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file publik & static yang dibutuhkan
COPY --from=builder /app/public ./public

# Ambil output standalone (hasil dari output: 'standalone' di next.config.js)
# Ini mencakup node_modules minimal yang dibutuhkan
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Jalankan server.js hasil standalone
CMD ["node", "server.js"]
