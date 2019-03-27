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

# Install runtime and dev dependencies
RUN cd /tmp/server && npm i --ignore-scripts

# Install runtime dependencies only
RUN cd /tmp/server-prod && npm i --production

# Copy sources
COPY . /tmp/server
COPY tmp/types /tmp/types

WORKDIR /tmp/server
