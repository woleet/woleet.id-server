# Client Web app

## Development mode

Install node packages:
    
    $ npm install

Start the web app in development mode:

    $ npm run dev
    
The web app will be served on `http://localhost:4220/`.

In development mode, live reload is enabled: the app will automatically reload if you change any of the source files.

### Production preview

Run `npm run dev:prod` instead to start the web app in production preview mode.

### Enable SSL

You can suffix `npm run dev[:prod]` with `:ssl` to run the app in SSL mode (the `WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE` and `WOLEET_ID_SEVER_HTTP_TLS_KEY` variables described in the [main README](../README.md) must be defined).

## Production mode

Install node packages:
    
    $ npm install

Build the web app:

    $ npm run build:prod

The build artifacts will be stored in the `dist/` directory.

Serve the web app:

You can then serve these static files the way you want.
In this repository this is done by using an NGinX server running in a Docker container (see [docker-compose.yml](../docker-compose.yml) and the [nginx](./nginx/) directory).
