# About

Woleet.ID Server is a lightweight web application to host inside your organization's IT.
It allows you to **manage your users' identities and bitcoin addresses**.
It allows your users to **sign data using their bitcoin addresses**.
It allows third-parties to **retrieve your users' identities from their bitcoin addresses** and to **verify that your organization controls these addresses**.

Woleet.ID Server identities are made of **X500 information** (common name, organization name, country code, etc.).
Each identity can be associated to one or several internal **bitcoin key pairs** made of a public bitcoin address and of a private key securely stored encrypted in the server's database.
Each identity can also be associated to one or several external **bitcoin addresses** (controlled by the user) using a secure registration mechanism ensuring the user effectively controls these addresses.

Basically, Woleet.ID Server provides a **private API** allowing your users to **sign data using their bitcoin addresses**,
and a **public API** allowing third-parties to **retrieve the identity of a signer from his bitcoin address** and to **verify that your organization controls this addresses**.

Basically, Woleet.ID Server enables you to integrate Woleet's [signature anchoring](https://doc.woleet.io/docs/signature-anchoring) into your organization workflow.
Signature anchoring goes far beyond data anchoring: while data anchoring allows creating a timestamped proof of existence of data,
signature anchoring allows creating a timestamped proof of signature of data, optionally embedding a proof of identity for the signer
(in the form of an **identity URL** served by Woleet.ID Server).
Using signature anchoring, new use cases like *document authentication* or *multi-signature workflow* are possible.

# Architecture

Woleet.ID Server is made of a Node.js server and a Angular/Material client web app.

**Angular/Material client web app**

The web app is intended for the server administrator only. It allows to configure the server and to manage users and their keys.
By default, it is exposed at [https://localhost:4220]().

The source code can be found in the `client/` directory.

**Node.js server**

The Node.js server exposes 4 groups of endpoints:

- **Signature endpoints** allowing to sign some data and to discover the identities managed by the server 
By default, they are exposed at [https://localhost:3002/sign]() and [https://localhost:3002/discover]() .
  
- An **Identity endpoint** allowing to retrieve and verify the user identity associated to a key.
By default, it is exposed at [https://localhost:3001/identity]().
**This endpoint need to be exposed publicly on the internet.**

- **API endpoints** dedicated to the client web app, but that can also be used by your backend.
By default, they are exposed at [https://localhost:3000/*]().

- **OpenID Connect endpoints** used only when Woleet.ID Server is used as an OpenID Connect provider.
By default, they are exposed at [https://localhost:3003/*]().

The source code can be found in the `server/` directory.

# Documentation

All endpoints of Woleet.ID Server, including those dedicated to the client web app, are documented using OpenAPI/Swagger (see the `swagger.yaml` file).
From this specification, test code (written in Java) is generated inside the `test/java` directory using the OpenAPI client code generator.

The Woleet.ID Server API documentation is published on [SwaggerHub](https://app.swaggerhub.com/apis-docs/Woleet/WoleetIDServerAPI).

# Deployment

Woleet.ID Server can be built and run using Docker (tested on Linux and  macOS), or directly on a Linux host.

> NOTE: Building and running the server and the client web app using Docker is the simplest way to go and is recommended for production environments.

Here we only document building and running Woleet.ID Server using Docker.
If you want to build or run without Docker, you can find detailed information about how to build and run Woleet.ID Server in [client's](client/README.md) and [server's](server/README.md) README files.

## Easy install

Supported Operating Systems:

- Linux CentOS
- Linux Debian
- Linux Ubuntu
- Linux Fedora

You must have the following software installed and configured:
- docker 18.09+
- docker-compose 1.22+

If your system matches these conditions, you can install Woleet.ID Server by running:

```bash
bash <(curl -s -o-  https://raw.githubusercontent.com/woleet/woleet.id-server/master/onlineSetup.sh)
```

As described below, you will need a certificate and its key on the computer you execute this script.

By default, the script:
- check server configuration
- clone the GitHub project to `$HOME/wids` directory
- store the path of your certificate and key files in the file `configuration.sh`

## configuration.sh

If you want to override some environment variables you can create a `configuration.sh` file: if it exists its content will be sourced in app.sh.

For example to fix a version for Woleet.ID Server (related to release tab) add this in `configuration.sh`:

```bash
export WOLEET_ID_SERVER_VERSION=x.x.x
```

# Prerequisites and configuration

## TLS certificate

Woleet.ID Server requires a TLS certificate.
It can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)
but it is highly recommended to use an Organization Validation (OV) certificate, since your organization's identity information will be extracted from this certificate during the identity verification process.

You need to set two environment variables pointing to the certificate and its associate key:

```bash
export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE={path to certificate .crt file}
export WOLEET_ID_SERVER_HTTP_TLS_KEY={path to certificate .key file}
```

### Renew TLS certificate

#### Normal mode

Just update the certificates files and do:

```bash
docker restart woleetid-server_wid-client_1
```

#### HA mode

In HA mode you will need to restart the whole stack to update the certificates once file are updated

```bash
./app.sh ha-restart
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

## Restart policy

By default, Docker automatically restarts Woleet.ID Server containers when they exit with a non-zero exit.
If you set the encryption secret by typing it when using ./app.sh start, the server will not be able to properly restart automatically, and you will have to use ./app.sh restart to recover.

You can choose between 4 type of restart policies:

- no (containers will never restart)
- on-failure (by default)
- unless-stopped (always restart unless explicitly stopped, or if Docker itself is stopped or restarted)
- always (always restart)

```bash
export WOLEET_ID_SERVER_RESTART_POLICY="always"
```

## Version

Woleet.ID Server have prebuilt images on DockerHub:  
<https://hub.docker.com/r/wids/client>  
<https://hub.docker.com/r/wids/server>

If the `WOLEET_ID_SERVER_VERSION` environment variable is set, `app.sh` and `docker-compose.yml` will use the specified version (> 0.5.0).

If you want to see the differences between versions, you can go to the [Release tab of GitHub](https://github.com/woleet/woleet.id-server/releases).

## Upgrade

If you have this project cloned and checked out to a commit that match with a tag (which is the case if you used `onlineSetup.sh` to install the project) you can use

```bash
./app.sh upgrade
```

to upgrade the repo to the latest tagged version. This also sets the `WOLEET_ID_SERVER_VERSION` environment variable to the latest one in the file `configuration.sh`.

Then, you need to restart the server to effectively use the upgraded version:

```bash
./app.sh start
```

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
export WOLEET_ID_SERVER_CLIENT_PORT={port where to expose the client web app (default: 4220)}
export WOLEET_ID_SERVER_API_PORT={port where to expose API endpoints (default: 3000)}
export WOLEET_ID_SERVER_IDENTITY_PORT={port where to expose the Identity endpoint (default: 3001)}
export WOLEET_ID_SERVER_SIGNATURE_PORT={port where to expose Signature endpoints (default 3002)}
export WOLEET_ID_SERVER_OIDCP_PORT={port where to expose OpenID Connect endpoints (default 3003)}
```

> WARNING: it is not recommended to expose these ports outside your organization's network, except for the Identity endpoint, which must be accessible publicly via the identity URL.

## Log directory

You choose or not to have your server log stored and if you choose to, daily log files will be stored in a directory that you can define with the environment variable:

```bash
export WOLEET_ID_SERVER_DAILY_ROTATE_FILE={boolean true if you want to store your log}
export WOLEET_ID_SERVER_LOG_DIRNAME={directory name where you want to store them}
```

By default the logs will be stored in the log directory.

# Build the server

```bash
./app.sh build
```

> NOTE: If you want Woleet.ID Server's Docker images to be stored on a specific Docker registry, you can set the `WOLEET_ID_SERVER_REGISTRY` environment variable.

If you want to build the server component without docker tou will need to install libpq for your OS (mandatory for using pg-native), follow instructions here: <https://www.npmjs.com/package/pg-native>

# Start the server

```bash
./app.sh start
```

# Display server logs

```bash
./app.sh logs -f
```

# Stop the server

```bash
./app.sh stop
```

# Backup the server

```bash
./app.sh backup <your_backup_path>
```

# Restore the server

```bash
./app.sh restore <your_backup_file>
```

# Upgrade the server

[See the documentation](#Version)

# Test the server

[Client web app](https://localhost:4220/)

You should see the sign in page.

[Identity endpoint](https://localhost:3001/identity)

You should get:

```json
{"name":"BadRequestError","message":"Missing \"pubKey\" parameter","status":400}
```

[Signature endpoints](https://localhost:3002/sign)

You should get:

```json
{"name":"UnauthorizedError","message":"Missing token","status":401}
```

[API endpoints](https://localhost:3000/info)

You should get:

```json
{"name":"UnauthorizedError","message":"Unauthorized","status":401}
```

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
- Enter the identity URL as you expose it to the internet: as an example, if your server domain is `idserver.acme.com`, the identity URL would be `https://idserver.acme.com:3001/identity`.

> WARNING: It is recommended to serve the identity URL on the default HTTPS port 443. To do this, simply set `WOLEET_ID_SERVER_IDENTITY_PORT` to 443.

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

You will be then able to get user information from your third party app. The associated OpenID client must request access to the `openid profile email` scope to get user information and `signature` scope to use the Signature endpoints.

# Secure the server

By default, only the Identity endpoint of Woleet.ID Server must be accessible publicly from the internet (via the server's identity URL).
All other endpoints can be firewalled to be only accessible from inside your organization intranet.

If you plan to use your Woleet.ID Server as an authentication and signature server for Woleet's ProofDesk for Teams SaaS application,
you will have to whitelist the IP addresses of Woleet's backend on the OpenID Connect and Signature endpoints.
Additionally, if you plan to allow you users to use ProofDesk for Teams from outside your organization network,
you will have to expose Woleet.ID Server's client web app and OpenID Connect endpoints publicly.

# High Availability / Docker Swarm mode

Woleet.ID Server can be deployed on a Docker Swarm cluster to achieve High Availability (HA) capabilities by running several server and client instances. 

## Prerequisites

- You must have a Docker Swarm cluster up and running
- You must know how to use and maintain a Docker Swarm cluster
- All the commands must be run on a Docker Swarm manager machine
- You must provide the PostgreSQL database (preferably with HA capabilities)

## Limitations

- Backing up and restoring the database cannot be done with `./app.sh`
- Logs are not available through `./app.sh`

## Setup

You can tune the configuration by using global variables, but the preferred way is to put them in the `configuration.sh` file

### Prepare project

```bash
git clone git@github.com:woleet/woleet.id-server.git
cd woleet.id-server
./app.sh upgrade # In this case it is used to create a configuration.sh file with `WOLEET_ID_SERVER_VERSION` set
```

### Configure the project

You can now find a `configuration.sh` file in the woleet.id-server folder.
You will need to add some mandatory properties in this file to be able to use Woleet.ID Server in a Docker Swarm environment.

```bash
export WOLEET_ID_SERVER_VERSION='x.x.x' # Set by ./app.sh upgrade, do not modify
export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE="" # Set the path of your SSL certificate
export WOLEET_ID_SERVER_HTTP_TLS_KEY=""  # Set the path of your SSL key
export WOLEET_ID_SERVER_POSTGRES_HOST="" # Set the URL of your PostgreSQL instance
export WOLEET_ID_SERVER_POSTGRES_DB="" # Set the database to use on your PostgreSQL instance
export WOLEET_ID_SERVER_POSTGRES_USER="" # Set your PostgreSQL username
export WOLEET_ID_SERVER_POSTGRES_PASSWORD="" # Set your PostgreSQL password
```

[You may also need change ports](#Server-ports)

### Running the project

Once configured you will be able to start Woleet.ID Server on a Docker Swarm cluster.
Here are some commands of the `./app.sh` file that are made to works in a Docker Swarm cluster:

- `./app.sh ha-start` # Start or update the Woleet.ID Server stack
- `./app.sh ha-stop` # Stop and clean the Woleet.ID Server stack (the encryption secret stay stored as a Docker secret, and the database is unaffected)
- `./app.sh ha-restart` # Stop then start the Woleet.ID Server stack
- `./app.sh ha-create-secret` # If you want to manually create a Docker secret before running the stack
- `./app.sh ha-delete-secret` # Delete the secret from the Docker secret storage
- `./app.sh ha-update-secret` # *WARNING* you can update the secret but this change will not be reflected onto the database.

`./app.sh upgrade` can still be used in a Docker Swarm environment to update your cluster to the latest version of Woleet.ID Server.

***IMPORTANT!*** Do not use other functions when running in Docker Swarm mode.

### First start

```bash
./app.sh ha-start
```

You will be prompted to choose a password to encrypt sensible data in the database, it will be store in a [docker secret](https://docs.docker.com/engine/swarm/secrets/).

If you have the environment variable `WOLEET_ID_SERVER_ENCRYPTION_SECRET` set, the secret used will be this one.

This secret will persist after stopping the Woleet.ID Server stack.

### Update SSL certificate

For now if you update your SSL certificates you will need to do `./app.sh ha-restart` as Docker Swarm do not update files used as configs or secrets if they change.

### Update stack

```bash
./app.sh upgrade && ./app.sh ha-start
```

### Scaling

Edit `configuration.sh` by adding:

```bash
export WOLEET_ID_SERVER_CLIENT_REPLICAS='{n}'
export WOLEET_ID_SERVER_SERVER_REPLICAS='{n}'
```

With {n} being the number of instances you want for each service (default is 2).

Then apply changes by doing `./app.sh ha-start`.
