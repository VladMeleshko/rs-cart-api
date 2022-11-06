FROM node:14-alpine AS base
WORKDIR /usr/src/app

FROM base AS dev-dependencies
COPY package*.json ./
RUN npm install \
    && npm cache clean --force

FROM dev-dependencies AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build \
    && rm -r node_modules

FROM node:14-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=dev-dependencies /usr/src/app/package.json ./
RUN npm install \
    && npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main.js" ]
