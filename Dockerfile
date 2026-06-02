<<<<<<< HEAD
=======
<<<<<<< HEAD
# =====================
# Builder
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# =====================
# Runner
# =====================
FROM node:20-alpine AS runner

=======
>>>>>>> e955c11b81feaba5ab5e953e8a32d3908ee268ed
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
<<<<<<< HEAD
WORKDIR /app

=======
>>>>>>> 929abeb (update docker file)
WORKDIR /app
ENV NODE_ENV=production

<<<<<<< HEAD
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
=======
>>>>>>> e955c11b81feaba5ab5e953e8a32d3908ee268ed
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
<<<<<<< HEAD
CMD ["node", "server.js"]
=======
CMD ["node", "server.js"]
>>>>>>> 929abeb (update docker file)
>>>>>>> e955c11b81feaba5ab5e953e8a32d3908ee268ed
