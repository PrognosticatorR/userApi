FROM node:alpine

WORKDIR /app

RUN apk add yarn

COPY ./package.json ./

RUN yarn

COPY ./ ./

CMD ["yarn", "start"]

EXPOSE 3000