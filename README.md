# About

Woleet.ID Server is a server (and an associated client web application) to be hosted inside your organization's IT.
It allows you to **manage the identity of your users and the set of cryptographic keys** they can use to sign data.

Woleet.ID Server identities are made of **X500 information** (like the common name, organization name, country code, etc.) 
associated to one or several **bitcoin keys** (each being made of a public bitcoin address and of a private key securely stored encrypted in the server's database).

Woleet.ID Server provides a **private API** allowing your users to **sign data using their bitcoin addresses**,
and a **public API** allowing third-parties to **get the identity of a signee** and **validate the ownership of the bitcoin addresses** by your organization.

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

## Easy install

If you run a fairly recent version of debian, ubuntu, centos or fedora you can install Woleet.ID Server by running:

```bash
curl -o- https://raw.githubusercontent.com/woleet/woleet.id-server/master/onlineSetup.sh | sh
```

You will need a certificate and its key, as described below, on the computer you execute this script.

By default it will install docker and other tolls needed and clone the project on you $HOME/wids directory, store the emplacement of your certificate and key in the file configuration.sh.

## configuration.sh

If you want to override some of the environnement variables you can do so in a configuration.sh file, if it exists its content will be sourced in app.sh.

For example to fix a version for Woleet.ID Server (related to release tab) add this in configuration.sh:

```bash
export WOLEET_ID_SERVER_VERSION=x.x.x
```

# Prerequisites and configuration

## TLS certificate

Woleet.ID Server requires a TLS certificate.
It can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)
but it is highly recommended to use an Organization Validation (OV) certificate, since your organization's identity information will be extracted from this certificate during the identity verification process).

You need to set two environment variables pointing to the certificate and its associate key:

```bash
export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE={path to certificate .crt file}
export WOLEET_ID_SERVER_HTTP_TLS_KEY={path to certificate .key file}
```

## Database

Woleet.ID Server requires a PostgreSQL database.
When run using Docker, the database is automatically deployed as a Docker container using a local directory to store data.
You can change the location of this directory by setting the following environment variable:

```bash
export WOLEET_ID_SERVER_DATA_DIR={path to the Docker volume where to store the database, default: ./db}
```

> NOTE: If you want to use Docker to run Woleet.ID Server but don't want ot use Docker to run the database,
you will have to modify the `docker-compose.yml` file and configure the database to use by setting the following environment variables:

```bash
export WOLEET_ID_SERVER_POSTGRES_HOST={PostgreSQL host, default: wid-postgres}
export WOLEET_ID_SERVER_POSTGRES_DB={PostgreSQL database, default: wid}
export WOLEET_ID_SERVER_POSTGRES_USER={PostgreSQL user, default: pguser}
export WOLEET_ID_SERVER_POSTGRES_PASSWORD=(PostgreSQL user password, default: pass}
```

## Version

Woleet.ID Server have prebuilt images on dockerhub:  
<https://hub.docker.com/r/wids/client>  
<https://hub.docker.com/r/wids/server>

If the environnement variable:

```bash
export WOLEET_ID_SERVER_VERSION=x.x.x
```

app.sh and docker-compose.yml will use the specified version (> 0.5.0), if you want to see differences between versions, you can go to the release tab of github.

If you have this project cloned and checkouted to a commit that match with a tag (for example, when using onlineSetup.sh to install the project) you can use

```bash
./app.sh upgrade
```

To upgrade the repo to the latest tagged version, it will also set the WOLEET_ID_SERVER_VERSION environnement variable to the latest one in the file configuration.sh

## Docker

Woleet.ID Server requires a recent Docker version:
 - docker 18.09+
 - docker-compose 1.22+

 To check your docker and docker-compose versions use `docker -v` and `docker-compose -v`.

## Encryption secret

Woleet.ID Server encrypts keys stored in the database using a encryption secret you need to define using the following environment variable:

```bash
export WOLEET_ID_SERVER_ENCRYPTION_SECRET={encryption secret, default: 'secret'}
```

> WARNING: don't forget to set your own the encryption secret before starting the server for the first time!

## Server ports

You can define the ports on which Woleet.ID Server listens by setting the following environment variables:

```bash
export WOLEET_ID_SERVER_API_PORT={port to use for the client web app and the server main API endpoints dedicated to the client web app, default: 3000}
export WOLEET_ID_SERVER_IDENTITY_PORT={port to use for the /identity endpoint, default: 3001}
export WOLEET_ID_SERVER_SIGNATURE_PORT={port to use for the /sign and /discover endpoints, default 3002}
```

> WARNING: the /sign endpoint (used to generate signature on behalf of users) and other API endpoints (used by the client web app) should never be exposed outside your organization's network, while the /identity endpoint needs to be exposed.

# Build the server

    ./app.sh build

> NOTE: If you want Woleet.ID Server's Docker images to be stored on a specific Docker registry, you can set the WOLEET_ID_SERVER_REGISTRY environment variable.

# Start the server

    ./app.sh start

# Display server logs
 
     ./app.sh logs -f
 
# Stop the server
 
    ./app.sh stop

# Backup the server

    ./app.sh backup <your_backup_path>

# Restore the server

    ./app.sh restore <your_backup_file>

# Upgrade the server

[See the documentation](##Version)

# Test the server

[Client web app](https://localhost:3000/)

You should see the sign in page.

[Identity endpoint](https://localhost:3001/identity)

You should get:

    { "message": "Missing mandatory \"pubKey\" parameter", "status": 400 }

[Signature endpoint](https://localhost:3002/sign)

You should get:

    { "message": "Invalid or missing API token", "status": 401 }

# Change administrator account password

When you run it for the first time, Woleet.ID Server creates an administrator account with login `admin` and password `pass`.
You need to change the password of the `admin` account.

- Open the client web app
- Sign in as admin
- Edit the 'admin' user and change his password: there is currently no way to recover passwords, so be sure you will not forget it

> NOTE: You can give administrator rights to any user account.

# Set server Identity URL

The identity URL is the public URL of the `/identity` endpoint.

- Open the client web app
- Sign in as admin
- Select the `Settings` menu
- Enter the identity URL as you expose it the the internet: as an example, if your server domain is `idserver.acme.com`, the identity URL would be `https://idserver.acme.com:3001/identity`.

> WARNING: It is preferable to serve the identity URL on the default HTTPS port 443. To do this, simply set WOLEET_ID_SERVER_IDENTITY_PORT to 443.

# Use Woleet.ID Server with an OpenID Connect provider

Woleet.ID Server can use an OpenID Connect provider to authenticate users.
When a new user connects to Woleet.ID Server using OpenID Connect, a user account is automatically created and a default key is generated.

- Select the `Settings` menu
- Go to the `OpenID Connect -> Client configuration` panel
- Check `Enable OpenID Connect client`
- Set the `OpenID Connect URL` in order to match `<OpenID Connect URL>/.well-known/openid-configuration`
- Set the `Client ID` and `Client secret` as defined by your provider
- Set the `Authorization callback URL` as `https://<current web interface>/oauth/callback` (it should be automatically set)

> NOTE: The "Use OpenID Connect" checkbox will be automatically unchecked if the server cannot reach the OpenID Connect URL

# Use Woleet.ID Server as an OpenID Connect provider

Woleet.ID Server can be used as an OpenID Connect provider by 3rd party applications.

- Select the `Settings` menu
- Go to the `OpenID Connect -> Provider configuration` panel
- Check `Enable OpenID Connect Provider`
- Set the `Issuer URL` as `https://<OpenID Issuer URL>`
  > Note: that is only if you want to conform to the Discovery specification, the `Issuer URL` value itself does not need to resolve to anything
- Set the `Provider URL` as `https://<OpenID Provider URL>` (it should be automatically set)
- Set the `Interface URL` as `https://<Web interface URL>` (it should be automatically set)
- Define a client:
  - Set the `Client Id` and `Client Secret` (it should be automatically set)
  - Set a least one `Redirect URI`

> NOTE: The OpenID Connect Provider will not be effectively enabled without at least one specified OpenID client.

You will be then able to get user information from your third party app. The associated OpenID client must request access to the `openid profile email` scope to get user information and `signature` to use the signature endpoint.
