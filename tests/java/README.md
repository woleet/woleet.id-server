# Setup tests

Running tests requires to set the following environment variables:

Credentials of an admin account:

    export WOLEET_ID_SERVER_ADMIN_LOGIN=admin
    export WOLEET_ID_SERVER_ADMIN_PASSWORD=...

Base paths of the various endpoints:

    export WOLEET_ID_SERVER_API_BASEPATH=https://localhost:3000/api
    export WOLEET_ID_SERVER_IDENTITY_BASEPATH=https://localhost:3001
    export WOLEET_ID_SERVER_SIGN_BASEPATH=https://localhost:3002

# Run tests

    $ mvn test
