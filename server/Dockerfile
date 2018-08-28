FROM node:10.9.0-alpine

RUN apk update && apk add python gcc g++ make bash

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

# Check app
RUN npm run check

RUN mv /usr/src/app/tmp/types /usr/src/types

EXPOSE 5432
CMD [ "npm", "start" ]
