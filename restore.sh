#!/usr/bin/env bash

set -e

display_env() {
  echo "env: $0 [docker|local]"
}

test_params() {
  if ! test -e "$file"; then
    echo "This file does not exist!"
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
  if test ${file##*.} = "sql"; then
    docker exec -i $image psql -U postgres < "$file"
  else
    echo "${file} is not a dump file"
  fi
}

if [ "$#" -eq 2 ]; then
  env=$1
  file=$2
  test_params
  start
else
  echo "$0 take the environment and the path of your dump file (*.sql)"
  display_env
fi
