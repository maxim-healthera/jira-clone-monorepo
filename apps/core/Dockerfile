FROM node:18.17.1 AS build
WORKDIR /app/builder
COPY --chown=node:node package.json package-lock.json ./
#todo npm i optimize
RUN npm i
RUN npm i pm2 -g
COPY --chown=node:node . .
RUN npx nx build core

#todo is alpine possible??
FROM node:18.17.1 As production
COPY --chown=node:node --from=build app/builder/node_modules ./node_modules
COPY --chown=node:node --from=build app/builder/dist ./dist
CMD ["node", "./dist/apps/core/main.js"]

FROM node:18.17.1 AS development
WORKDIR /app/builder
# COPY --chown=node:node package*.json package-lock.json ./
COPY package*.json ./
RUN npm i --include=optional
# COPY --chown=node:node . .
COPY . .

# USER node
CMD ["npx", "nx", "serve", "core"]
