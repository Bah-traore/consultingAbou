# Stage 1: Install dependencies and build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build-time environment variables for Next.js client-side bundles
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_R2_CUSTOM_DOMAIN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_R2_CUSTOM_DOMAIN=$NEXT_PUBLIC_R2_CUSTOM_DOMAIN
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy build output and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
