FROM node:20-alpine as node_base

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm; \
    npm install
COPY . .

FROM node_base as front_prod
RUN npm run build

FROM node_base as front_dev
RUN apk add --no-cache git; \
    git config --global --add safe.directory /app
CMD ["npm", "run", "dev"]
EXPOSE 3000
