FROM node:14 as base
# RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . /usr/src/nuxt-app
COPY package.json /usr/src/nuxt-app
RUN npm install

# Development
FROM base as dev
CMD ["npm","run","dev"]

# Production
FROM base as production
RUN npm run build
CMD ["npm","run","start"]