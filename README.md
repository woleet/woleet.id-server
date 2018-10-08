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

Woleet.ID Server is made of a Node.js server and a Angular/Material web application.

**Angular Web app**

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

## Build and run without Docker

Running the server and the web app without Docker is useful for development purpose. 

### Prerequisites

You need _gcc, g++, make, bash, python, docker_ and _node.js_ (with _npm_) to be installed on your system to build the project.

### Set up the project

In both `client/` and `server/` directories, run: `npm install`.

### Start the project

In the project's root directory, run the `start-pg-dev.sh` script to start PostgreSQL in a Docker container.

Finally, in both `client/` and `server/` directories, run: `npm run dev`.

Detailed information is available in [client's](client/README.md) and [server's](server/README.md) README files. 

## Build and run using Docker

Running the server and the web app using Docker is recommended for production environment.
 
### Prerequisites

You must have a certificate for your server: (it can be [self signed](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04))

```
HTTP_TLS_CERTIFICATE=path/to/certificate.crt
HTTP_TLS_KEY=path/to/certificate.key
```

### Build the project

    ./app build

### Start the project

    ./app start

### Stop the project:

    ./app stop
