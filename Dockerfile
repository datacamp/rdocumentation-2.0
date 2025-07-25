ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /usr/app
# First copy only package.json & yarn.lock and run yarn install, this will make
# docker cache these steps if those files didn't change
COPY package.json yarn.lock ./

ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && yarn install --frozen-lock-file && rm -f .npmrc

# Copy all the other source files we need to build
COPY . .

RUN yarn build

# Main
FROM node:${NODE_VERSION}

RUN apk --no-cache add curl bash
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Only copy the files actually needed to run the app, this will make our docker
# image significant smaller and we don't leak uncompiled source code to production
COPY --from=dependencies /usr/app/package.json ./
COPY --from=dependencies /usr/app/next.config.js ./
COPY --from=dependencies /usr/app/node_modules ./node_modules
COPY --from=dependencies /usr/app/.next ./.next
COPY --from=dependencies /usr/app/public ./public

ENV PORT 3000
EXPOSE 3000

CMD ["yarn", "start"]
