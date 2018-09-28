# Koa server in typescript

## Development mode:
### Install
#### Install the node packages:
    
    $ npm install

#### Then to start the server in development mode run:

    $ npm run dev

## Production mode:
### Install
#### Install the node packages:

    $ npm install --production

#### Build the server:

    $ npm run build

The build artifacts will be located in the `dist/` directory.

#### Run the server:

    $ npm start

## Configuration

You can define ports to listen by setting the following environment variables:
 - WOLEET_ID_SERVER_DEFAULT_PORT (default: 3000)
 - WOLEET_ID_SERVER_SIGNATURE_PORT
 - WOLEET_ID_SERVER_IDENTITY_PORT
 - WOLEET_ID_SERVER_API_PORT

To configure the targeted database you have to set the following environment variables:
 - POSTGRES_HOST
 - POSTGRES_DB
 - POSTGRES_USER
 - POSTGRES_PASSWORD
