# Builder stage
FROM node:22-alpine AS builder
RUN npm install -g pnpm@10

WORKDIR /build

COPY . .

#RUN pnpm install
#RUN pnpm build

# Runner stage
FROM node:22-alpine AS runner

EXPOSE 3000

WORKDIR /app

#COPY --from=builder /build/dist ./dist
#COPY --from=builder /build/package.json ./
#COPY --from=builder /build/pnpm-lock.yaml ./
#
#RUN npm install

ENV NODE_ENV=dev
CMD ["node"]