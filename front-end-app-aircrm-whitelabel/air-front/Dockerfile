# ─────────────────────────────────────────────────────────────────────────────
# AIR Ecosystem — Dashboard Frontend
# Copyright (c) 2024–2026 AIR Ecosystem. All Rights Reserved.
# Proprietary and confidential — do not distribute.
# ─────────────────────────────────────────────────────────────────────────────

# Stage 1: Build
FROM node:20-alpine AS builder

LABEL stage="builder"
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Install dependencies (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source & build
COPY . .
ARG VITE_API_URL=/api
ARG VITE_DEV_HTTPS=false
ENV VITE_DEV_HTTPS=false
RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:1.25-alpine

LABEL maintainer="AIR Ecosystem <dev@air-ecosystem.com>"
LABEL org.opencontainers.image.title="AIR Store Platform — Frontend"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.licenses="Proprietary"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
