# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

RUN npm install -g @nestjs/cli
RUN nest --version

COPY . .

RUN npm run build
EXPOSE 3000

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
RUN nest --version

COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD ["node", "dist/main"]