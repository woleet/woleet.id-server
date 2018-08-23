FROM node:10.9.0-alpine

RUN mkdir /tmp/build

COPY . /tmp/build

COPY tmp/types /tmp/types

RUN cd /tmp/build && npm i && npm run build:prod && mv dist/client /tmp/client && rm -rf /tmp/build && rm -rf /tmp/types
