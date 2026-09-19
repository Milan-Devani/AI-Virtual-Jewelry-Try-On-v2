FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY src ./src
COPY tests ./tests
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 10000

CMD ["node", "dist/server.js"]
