FROM node:latest as build

WORKDIR /app

COPY package.json ./

RUN yarn install --verbose --no-cache

COPY . .
# COPY set-env.js .
RUN yarn build:ssr


# Stage 2: Set up the server

FROM node:latest as serve

WORKDIR /app

COPY --from=build /app/dist ./dist


EXPOSE 4000

CMD [ "node", "dist/stackbuld-ecommerce/server/main.js" ]

