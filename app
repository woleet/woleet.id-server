#!/usr/bin/env bash

display_usage() {
  echo "Usage: $0 [start|stop|push|build] [local|master]"
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
  echo "Cleaning types..."
  rm -rf $tmp_client_dir
  rm -rf $tmp_server_dir
}

operation=$1
shift
target=$1
shift

if [ "$target" == "master" ]; then
  compose="-f docker-compose.yml -f docker-compose.master.yml"
elif [ "$target" == "local" ]; then
  compose="-f docker-compose.yml -f docker-compose.local.yml"
else
  display_usage
  exit -1
fi

if [ "$operation" == "start" ]; then
  docker-compose ${compose} up -d
  # TODO: split start & log
  if [ "$1" != "--no-log" ]; then
    docker-compose ${compose} logs -f --tail 50
  fi
elif [ "$operation" == "stop" ]; then
  docker-compose ${compose} down
elif [ "$operation" == "push" ]; then
  docker-compose ${compose} push
elif [ "$operation" == "build" ]; then
  prebuild
  echo "Building client builder image (wid-client-builder)..."
  cd client; docker build -f Dockerfile.builder -t wid-client-builder .; cd ..
  echo "done"
  docker-compose ${compose} build
  postbuild
else
  display_usage
  exit -1
fi
