# Setup tests

Running tests requires to set the following environment variables:

## Credentials of an admin account:

    export WOLEET_ID_SERVER_ADMIN_LOGIN=admin
    export WOLEET_ID_SERVER_ADMIN_PASSWORD=pass

## Base paths of the various endpoints:

### Docker mode

    export WOLEET_ID_SERVER_API_BASEPATH=https://localhost:3000/api
    export WOLEET_ID_SERVER_IDENTITY_BASEPATH=https://localhost:3001
    export WOLEET_ID_SERVER_SIGNATURE_BASEPATH=https://localhost:3002

### Local mode

    export WOLEET_ID_SERVER_API_BASEPATH=https://localhost:3000
    export WOLEET_ID_SERVER_IDENTITY_BASEPATH=https://localhost:3000
    export WOLEET_ID_SERVER_SIGNATURE_BASEPATH=https://localhost:3000

# Run tests

    $ mvn test
