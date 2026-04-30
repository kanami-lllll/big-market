FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm config set registry 'https://registry.npmmirror.com/'
RUN npm ci

FROM base AS builder
WORKDIR /app
ARG API_HOST_URL=http://localhost:8098
ARG NEXT_PUBLIC_API_HOST_URL=http://localhost:8098
ENV API_HOST_URL=${API_HOST_URL}
ENV NEXT_PUBLIC_API_HOST_URL=${NEXT_PUBLIC_API_HOST_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
