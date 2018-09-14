# Woleet.ID Server

# About

The **Woleet.ID Server** application facilitates the integration of Woleet's [signature anchoring](https://medium.com/@woleet/beyond-data-anchoring-bee867d9be3a) functionality into your corporate workflow, by providing what you need to easily:
 * manage the identity and associated bitcoin addresses of your corporate users
 * sign data on behalf of your corporate users using their bitcoin addresses
 * expose the identity of your corporate users and prove the ownership of their bitcoin addresses 
 
# Build and run without Docker (development mode)

## Prerequisites

You need _gcc, g++, make, bash, python, docker_ and _node.js_ (with _npm_) to be installed on your system to build the project. 

## Set up the project:

In both _client_ and _server_ directories, run: `npm install`. 

## Start up the project:

In the project's root directory, run the `start-pg-dev` script to start PostgreSQL.

Finally, in both _client_ and _server_ directories, run: `npm run dev`. 

# Build and run using Docker (production mode)

## Prerequisites

You must have a certificate for your server: (it can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04))

```
HTTP_TLS_CERTIFICATE=path/to/certificate.crt
HTTP_TLS_KEY=path/to/certificate.key
```

## Build the project:

    ./app build

## Start up the project:

    ./app start

## Stop the project:

    ./app stop
