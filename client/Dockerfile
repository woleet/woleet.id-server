FROM nginx:mainline-alpine

COPY --from=wid-client-build:latest /tmp/client /usr/share/nginx/html
COPY ./nginx /etc/nginx
