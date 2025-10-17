FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
VOLUME ["/data"]
EXPOSE 3000
CMD ["sh","-lc","npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]
