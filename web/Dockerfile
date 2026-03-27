FROM node:20-bookworm-slim AS build

WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY docker-static-server.js ./docker-static-server.js

EXPOSE 3000

CMD ["node", "docker-static-server.js"]
