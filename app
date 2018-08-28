#!/usr/bin/env bash

set -e

display_usage() {
  echo "usage: $0 [start|stop|build|push]"
}

tmp_client_dir=./client/tmp/
tmp_server_dir=./server/tmp/

prebuild () {
  # copy "types" folder into both server and client
  # to make it accessible from each docker contexts
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
elif [ "$operation" == "build" ]; then
  echo "copying common resources"
  prebuild

  echo "building intermediate image (wid-client-builder)"
  cd client; docker build -f Dockerfile.builder -t wid-client-builder .; cd ..

  docker-compose build $@

  echo "cleaning up"
  postbuild
else
  display_usage
  exit -1
fi
