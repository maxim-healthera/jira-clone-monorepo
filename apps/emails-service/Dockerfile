FROM node:18.17.1 as build

WORKDIR /app/builder
COPY --chown=node:node package.json package-lock.json ./
RUN npm i
RUN npm i pm2 -g
COPY --chown=node:node . .
RUN npx nx build emails-service

FROM node:18.17.1 As production
COPY --chown=node:node --from=build app/builder/node_modules ./node_modules
COPY --chown=node:node --from=build app/builder/dist ./dist
CMD ["node", "./dist/apps/emails-service/main.js"]

FROM node:18.17.1 AS development
WORKDIR /app/builder
# COPY --chown=node:node package*.json package-lock.json ./
COPY package*.json ./
RUN npm i
# COPY --chown=node:node . .
COPY . .
# USER node
CMD ["npx", "nx", "serve", "emails-service"]
