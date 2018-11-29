# Node.js Server

### Prerequisites

The `WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE` and `WOLEET_ID_SEVER_HTTP_TLS_KEY` environment variables described in the [main README](../README.md) must be defined.

## Development mode

Install node packages:
    
    $ npm install

Start the server in development mode:

    $ npm run dev

## Production mode

Install node packages:

    $ npm install

Build the server:

    $ npm run build

The build artifacts will be located in the `dist/` directory.

Run the server:

    $ npm start
