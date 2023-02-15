FROM node:16-alpine as builld-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:1.19.10-alpine

COPY --from=builld-step /app/dist/biblioteca-valle-frond-end /usr/share/nginx/html

