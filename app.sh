#!/usr/bin/env bash

set -e

display_usage() {
  echo "usage: $0 [start|stop|build|push|check]"
}

tmp_client_dir=./client/tmp/
tmp_server_dir=./server/tmp/

prebuild () {
  # copy "types" folder into both server and client
  # to make it accessible from each docker contexts
  echo "Copying types..."
  rm -rf $tmp_client_dir
  rm -rf $tmp_server_dir

  mkdir -p $tmp_client_dir
  mkdir -p $tmp_server_dir

  cp -R types $tmp_client_dir
  cp -R types $tmp_server_dir
}

postbuild () {
  rm -rf $tmp_client_dir
  rm -rf $tmp_server_dir
}

operation=$1

if [ -z $operation ]; then
  display_usage
  exit -1
fi

shift

if [ "$operation" == "start" ]; then
  docker-compose up -d
  #TODO: split start & log
  if [ "$1" != "--no-log" ]; then
    docker-compose logs -f --tail 50
  fi
elif [ "$operation" == "stop" ]; then
  docker-compose down
elif [ "$operation" == "push" ]; then
  docker-compose push
elif [ "$operation" == "check" ]; then
  cd server
  npm run lint
  npm run check
  cd ../client
  npm run lint
elif [ "$operation" == "build" ]; then
  prebuild

  echo "Building client builder image (wid-client-builder)..."
  cd client; docker build -f Dockerfile.builder -t wid-client-builder .; cd ..
  echo "Done."

  echo "Compiling client source (wid-client-build)..."
  cd client; docker build -f Dockerfile.build -t wid-client-build .; cd ..
  echo "Done."

  echo "Copying client source to final image (wid-client)..."
  docker-compose build
  echo "Done."

  postbuild
else
  display_usage
  exit -1
fi
