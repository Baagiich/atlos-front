FROM node:20-alpine as node_base

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm; \
    npm install
COPY . .
FROM node_base as front_dev
CMD ["npm", "run", "dev"]
EXPOSE 3000

FROM node_base as front_prod
RUN npm run build

