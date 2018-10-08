# About

Woleet.ID Server is a web application and server to be hosted inside your organization's IT.
 It allows you to **manage the identity of your users and the set of cryptographic keys** they can use to sign data.
 
Woleet.ID Server identities are made of **X509 information** (like the common name, organization name, country code, etc.) 
 associated to one or several **bitcoin keys** (each being made of a public bitcoin address and of a private key securely stored inside Woleet.ID Server's DB).
 
Woleet.ID Server provides a private API allowing you or your users to **sign data using their bitcoin addresses**,
 and a public API allowing third-parties to **get the identity of your users** and **validate the ownership of their bitcoin adresses** by your organization.

Basically, Woleet.ID Server enables you to integrate Woleet's [signature anchoring](https://doc.woleet.io/docs/signature-anchoring) into your organization workflow.

Signature anchoring goes far beyond data anchoring: while data anchoring allows creating a timestamped proof of existence of data,
signature anchoring allows creating a timestamped proof of signature of data, optionally embedding a proof of identity of the signee
(an identity URL served by Woleet.ID Server).

Using signature anchoring, new use cases like document authentication or multi signature workflow are possible.

# Architecture

Woleet.ID Server is made of a Node.js server and a Angular/Material client web application.

**Angular/Material client web app**

The web app is intended for the server administrator only. It allows to configure the server and to manage users and their keys.
The source code can be found in the `client/` directory.

**Node.js server**

The Node.js server exposes several APIs:
- a `/sign` endpoint exposed internally and allowing to sign using the organization's default key or one of the user's keys
- an `/identity` endpoint exposed externally and allowing to retrieve and verify users' identity.
- an API dedicated to the web application.

The source code can be found in the `server/` directory.

**Documentation and tests**

All APIs, including the API dedicated to the web application, are specified and documented using OpenAPI (see the `swagger.yaml` file).
From this specification, APIs client and test code (written in Java) is generated inside the `test/java` directory.

# Deployment

Woleet.ID Server can be run using Docker (tested on Linux and  macOS), or directly on a Linux host.

> NOTE: Building and running the server and the web app using Docker is the simplest way to go and is recommended for production environments.

Here we only document building and running Woleet.ID Server using Docker.
If you want to build or run without Docker, you can find detailed information about how to build and run Woleet.ID Server in [client's](client/README.md) and [server's](server/README.md) README files. 

## Prerequisites

You need a TLS certificate for your server. It can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)
but it is highly recommended to use a Organization Validation (OV) certificate, since your organization's identity information will be extracted from this certificate during the identity verification process).

You need to set two environment variables pointing to the certificate and its associate key:
```
export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE=path/to/certificate.crt
export WOLEET_ID_SERVER_HTTP_TLS_KEY=path/to/certificate.key
```

## Install the database

The server requires a PostgreSQL database (version >=10).

To configure the targeted database you need to set the following environment variables:
```
export WOLEET_ID_SERVER_POSTGRES_HOST=wid-postgres
WOLEET_ID_SERVER_POSTGRES_DB
WOLEET_ID_SERVER_POSTGRES_USER
WOLEET_ID_SERVER_POSTGRES_PASSWORD
```

      WOLEET_ID_SERVER_POSTGRES_DB: wid
      WOLEET_ID_SERVER_POSTGRES_USER: pguser
      WOLEET_ID_SERVER_POSTGRES_PASSWORD: pass
      WOLEET_ID_SERVER_POSTGRES_HOST: wid-postgres

 
## Build the project

    ./app.sh build

> NOTE: If you want Woleet.ID Server's Docker images to be stored on a specific Docker registry, you can set the WOLEET_ID_SERVER_REGISTRY environment variable.

## Configure the project

WOLEET_ID_SERVER_ADMIN_LOGIN='admin'
WOLEET_ID_SERVER_ADMIN_PASSWORD='pass'
WOLEET_ID_SERVER_API_URL='https://dev2.woleet.io:4220/api'
WOLEET_ID_SERVER_ENCRYPTION_SECRET

You can define ports to listen by setting the following environment variables:
 - WOLEET_ID_SERVER_DEFAULT_PORT (default: 3000)
 - WOLEET_ID_SERVER_SIGNATURE_PORT
 - WOLEET_ID_SERVER_IDENTITY_PORT
 - WOLEET_ID_SERVER_API_PORT

### Start the project

    ./app.sh start

### Stop the project:

    ./app.sh stop

