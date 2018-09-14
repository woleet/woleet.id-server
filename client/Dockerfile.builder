FROM node:10.9.0-alpine

RUN mkdir /tmp/build

COPY package.json /tmp/build/
COPY package-lock.json /tmp/build/

RUN cd /tmp/build && npm i

COPY . /tmp/build

COPY tmp/types /tmp/types

WORKDIR /tmp/build
