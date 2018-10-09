FROM node:10.9.0-alpine

RUN apk update && apk add python gcc g++ make bash --virtual .build-deps

# Build

RUN node -v
RUN npm -v

RUN mkdir /tmp/server
RUN mkdir /tmp/server-prod

# Copy dev package.json
COPY package.json /tmp/server/
COPY package-lock.json /tmp/server/

COPY package.json /tmp/server-prod/
COPY package-lock.json /tmp/server-prod/

# Install build dependencies
RUN cd /tmp/server && npm i --ignore-scripts

# Install prod dependencies
RUN cd /tmp/server-prod && npm i --production

# Copy source
COPY . /tmp/server

COPY tmp/types /tmp/types

WORKDIR /tmp/server
