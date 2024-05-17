FROM node:20.12.1-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .
# COPY set-env.js .
RUN yarn build:ssr


# Stage 2: Set up the server

FROM node:20.12.1-alpine as serve

WORKDIR /app

COPY --from=build /app/dist ./dist


EXPOSE 4000

CMD [ "node", "dist/stackbuld-ecommerce/server/main.js" ]

