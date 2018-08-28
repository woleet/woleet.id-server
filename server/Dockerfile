FROM node:10.9.0-alpine

RUN apk update && apk add python gcc g++ make bash --virtual .build-deps

# Build

RUN node -v
RUN npm -v

## Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

## Install app dependencies
COPY package.json /usr/src/app/
# RUN npm i --silent
RUN npm i

## Bundle app source
COPY . /usr/src/app

RUN mv /usr/src/app/tmp/types /usr/src/types

# Build server
RUN npm run build

RUN mv /usr/src/app/dist/app /usr/src/app/dist/server

RUN apk del .build-deps

EXPOSE 3000

CMD [ "npm", "start" ]
