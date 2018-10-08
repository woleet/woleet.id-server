FROM node:10.9.0-alpine

COPY --from=wid-server-build:latest /tmp/app /usr/src/app

WORKDIR /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
