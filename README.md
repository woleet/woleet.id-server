# About

Woleet.ID Server is a server (and an associated client web application) to be hosted inside your organization's IT.
It allows you to **manage the identity of your users and the set of cryptographic keys** they can use to sign data.
 
Woleet.ID Server identities are made of **X500 information** (like the common name, organization name, country code, etc.) 
associated to one or several **bitcoin keys** (each being made of a public bitcoin address and of a private key securely stored encrypted in the server's database).
 
Woleet.ID Server provides a **private API** allowing your users to **sign data using their bitcoin addresses**,
and a **public API** allowing third-parties to **get the identity of a signee** and **validate the ownership of the bitcoin adresses** by your organization.

Basically, Woleet.ID Server enables you to integrate Woleet's [signature anchoring](https://doc.woleet.io/docs/signature-anchoring) into your organization workflow.

Signature anchoring goes far beyond data anchoring: while data anchoring allows creating a timestamped proof of existence of data,
signature anchoring allows creating a timestamped proof of signature of data, optionally embedding a proof of identity for the signee
(in the form of an **identity URL** served by Woleet.ID Server).

Using signature anchoring, new use cases like *document authentication* or *multi-signature workflow* are possible.

# Architecture

Woleet.ID Server is made of a Node.js server and a Angular/Material client web app.

**Angular/Material client web app**

The web app is intended for the server administrator only. It allows to configure the server and to manage users and their keys.

The source code can be found in the `client/` directory.

**Node.js server**

The Node.js server exposes several endpoints:
- a `/sign` endpoint exposed internally and allowing to sign using the organization's default key or one of the user's keys
- an `/identity` endpoint exposed externally and allowing to retrieve and verify users' identity.
- a set of API endpoints dedicated to the client web app.

The source code can be found in the `server/` directory.

**Documentation and tests**

All endpoints, including those dedicated to the client web app, are specified and documented using OpenAPI (see the `swagger.yaml` file).
From this specification, test code (written in Java) is generated inside the `test/java` directory using the OpenAPI client code generator.

# Deployment

Woleet.ID Server can be built and run using Docker (tested on Linux and  macOS), or directly on a Linux host.

> NOTE: Building and running the server and the client web app using Docker is the simplest way to go and is recommended for production environments.

Here we only document building and running Woleet.ID Server using Docker.
If you want to build or run without Docker, you can find detailed information about how to build and run Woleet.ID Server in [client's](client/README.md) and [server's](server/README.md) README files. 

# Prerequisites and configuration

## TLS certificate

Woleet.ID Server requires a TLS certificate.
It can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)
but it is highly recommended to use an Organization Validation (OV) certificate, since your organization's identity information will be extracted from this certificate during the identity verification process).

You need to set two environment variables pointing to the certificate and its associate key:
```
export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE={path to certificate .crt file}
export WOLEET_ID_SERVER_HTTP_TLS_KEY={path to certificate .key file}
```

## Database

Woleet.ID Server requires a PostgreSQL database.
When run using Docker, the database is automatically deployed as a Docker container using a local directory to store data.
You can change the location of this directory by setting the following environment variable: 
```
export WOLEET_ID_SERVER_DATA_DIR={path to the Docker volume where to store the database, default: ./db}
```

> NOTE: If you want to use Docker to run Woleet.ID Server but don't want ot use Docker to run the database,
you will have to modify the `docker-compose.yml` file and configure the database to use by setting the following environment variables:
```
export WOLEET_ID_SERVER_POSTGRES_HOST={PostgreSQL host, default: wid-postgres}
export WOLEET_ID_SERVER_POSTGRES_DB={PostgreSQL database, default: wid}
export WOLEET_ID_SERVER_POSTGRES_USER={PostgreSQL user, default: pguser}
export WOLEET_ID_SERVER_POSTGRES_PASSWORD=(PostgreSQL user password, default: pass}
```

## Encryption secret

Woleet.ID Server encrypts keys stored in the database using a encryption secret you need to define using the following environment variable:
```
export WOLEET_ID_SERVER_ENCRYPTION_SECRET={encryption secret, default: 'secret'}
```
> WARNING: don't forget to set your own the encryption secret before starting the server for the first time!

## Server ports

You can define the ports on which Woleet.ID Server listens by setting the following environment variables:
```
export WOLEET_ID_SERVER_API_PORT={port to use for the client web app and the server API endpoints dedicated to the client web app), default: 3000}
export WOLEET_ID_SERVER_IDENTITY_PORT={port to use for the /identity endpoint, default: 3001}
export WOLEET_ID_SERVER_SIGN_PORT={port to use for the /sign endpoint, default 3002}
```

> WARNING: the /sign endpoint (used to generate signature on behalf of users) and other API endpoints (used by the client web app) should never be exposed outside your organization's network, while the /identity endpoint needs to be exposed.

# Build the server

    ./app.sh build

> NOTE: If you want Woleet.ID Server's Docker images to be stored on a specific Docker registry, you can set the WOLEET_ID_SERVER_REGISTRY environment variable.

# Start the server

    ./app.sh start

# Test the server

[Client web app](https://localhost:3000/)

You should see the sign in page.

[Identity endpoint](https://localhost:3001/identity)

You should get:

    { "message": "Missing mandatory \"pubKey\" parameter", "status": 400 }

[Signature endpoint](https://localhost:3002/sign)

You should get:

    { "message": "Invalid or missing API token", "status": 401 }
 
### Display server logs
 
     ./app.sh logs -f
 
### Stop the server
 
    ./app.sh stop
 
## Configuration
### Change administrator account password
 
When you run it for the first time, Woleet.&#8203;ID Server creates an administrator account with login `admin` and password `pass`.
You need to change the password of the `admin` account.
 
- Open the client web app
- Sign in as admin
- Edit the 'admin' user and change his password: there is currently no way to recover passwords, so be sure you will not forget it
 
> NOTE: You can give administrator rights to any user account.
 
### Set server Identity URL
 
The identity URL is the public URL of the `/identity` endpoint.
 
- Open the client web app
- Sign in as admin
- Select the `Settings` menu
- Enter the identity URL as you expose it the the internet: as an example, if your server domain is `idserver.acme.com`, the identity URL would be `https://idserver.acme.com:3001/identity`.
 
> WARNING: It is preferable to serve the identity URL on the default HTTPS port 443. To do this, simply set WOLEET_ID_SERVER_IDENTITY_PORT to 443.
 
### Use an Open ID Connect provider
 
You can use an OpenID user provider with Woleet.&#8203;ID Server.
In the "OpenID Connect configuration" panel: 
- Check "Use OpenID Connect"
- Set the `Open ID Connect URL` in order to match `<Open ID Connect URL>/.well-known/openid-configuration`.
- Set the `Client id` and `Client secret` as defined by your provider.
- Set the `Authorization callback URL` as `https://<Current web interface>/oauth/callback` (it should be automatically set).
 
> NOTE: The "Use OpenID Connect" checkbox will be automatically unchecked if the server cannot reach the OpenID provider.
 
### Use Woleet.&#8203;ID Server as an Open ID Connect provider
 
You can be uses as an OpenID provider.
In the "OpenID Connect Provider configuration" panel: 
- Check "Enable OpenID Connect Provider"
- Set the `Issuer URL` in order to match `<Open ID Connect Provider URL>/.well-known/openid-configuration`.
  > Note: that is only if you want to conform to the Discovery specification, the `Issuer URL` value itself does not need to resolve to anything.
- Set the `Provider URL` as `https://<OpenID Provider>` (it should be automatically set).
- Set the `Interface URL` as `https://<Current web interface>` (it should be automatically set).
- Define a client:
  - Set the `ClientId` and `Client Secret` (it should be automatically set).
  - Set a least one `Redirect URI`.
 
> NOTE: The OpenID Connect Provider will not be effectively enabled without at least one specified client.

You will be then able to get user information from your third party app. The associated OpenID client must request access to the `openid profile email` scope to get user information and `signature` to use the signature endpoint.
