# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

FROM base AS deps

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

FROM deps AS builder

ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_SITE_URL=http://localhost:4173
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SITE_URL=${VITE_SITE_URL}

COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true --ignore-scripts && yarn cache clean

COPY server ./server
COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["node", "server/index.mjs"]
