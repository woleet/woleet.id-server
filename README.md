woleet.id-server
================

# About

# Usage 

## In a local development mode 

### Dependencies 

You will need _gcc, g++, make, bash, python, docker_ and _node.js_ (with _npm_) to be installed on your system to build the project outside a docker container. 

### Set up the project 
In both _client_ and _server_ directories, run: `npm install`. 

### Start up the project 
In the project's root directory, run the `start-pg-dev` script to start postgresql in.

Finally, in both _client_ and _server_ directories, run: `npm run dev`. 

## With docker 
### Build the project 
    ./app build [local|master|prod]

### Start up the project 
    ./app start [local|master|prod]

### Stop the project 
    ./app stop [local|master|prod]

