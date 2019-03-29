#!/usr/bin/env bash

set -e

display_env() {
  echo "env: $0 [docker|local]"
}

test_params() {
  if ! test -e "$path"; then
    echo "This path does not exist!"
    exit 0
  fi
  if ! [[ $env =~ local|docker ]]; then
    display_env
    exit 0
  fi
}

start() {
  if [[ $env =~ local ]]; then
    image=pg-dev
  elif [[ $env =~ docker ]]; then
    image=woleetid-server_wid-postgres_1
  fi
  if test -e "$path"; then
    echo "Create dump_${env}_$(date +%d-%m-%Y"_"%H_%M_%S).sql in $path."
    docker exec -t $image pg_dumpall -c -U postgres > "$path/dump_${env}_$(date +%d-%m-%Y"_"%H_%M_%S).sql"
  else
    echo "This path does not exist!"
  fi
}

if [ "$#" -eq 2 ]; then
  env=$1
  path=$2
  test_params
  start
else
  echo "Not enough mineral!"
fi
