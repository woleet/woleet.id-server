FROM nginx:mainline-alpine

# COPY ./dist/client /usr/share/nginx/html
# COPY ./tmp/types /usr/share/nginx/types
COPY --from=wid-client-builder:latest /tmp/client /usr/share/nginx/html
COPY ./nginx /etc/nginx
