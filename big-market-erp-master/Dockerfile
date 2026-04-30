FROM node:18-alpine AS deps
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/ && npm install -g pnpm@8.15.9
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/ && npm install -g pnpm@8.15.9
ARG UMI_APP_API_HOST_URL=http://localhost:8098
ARG UMI_APP_SKIP_AUTH=true
ENV UMI_APP_API_HOST_URL=${UMI_APP_API_HOST_URL}
ENV UMI_APP_SKIP_AUTH=${UMI_APP_SKIP_AUTH}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM nginx:1.25-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
