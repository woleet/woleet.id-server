#!/usr/bin/env bash

set -e

display_usage_app() {
  echo "usage: $0 [start|stop|restart|build|push|check|logs|backup|restore]"
}

tmp_client_dir=./client/tmp/
tmp_server_dir=./server/tmp/

prebuild() {
  # Copy "types" folder into both server and client to make it accessible from each docker contexts
  echo "Copying types..."
  rm -rf $tmp_client_dir
  rm -rf $tmp_server_dir

  mkdir -p $tmp_client_dir
  mkdir -p $tmp_server_dir

  cp -R types $tmp_client_dir
  cp -R types $tmp_server_dir
}

postbuild() {
  rm -rf $tmp_client_dir
  rm -rf $tmp_server_dir
}

start() {
  local old_server=$(docker ps | grep woleetid-server_wid-server_1 | cut -d' ' -f 1)
  docker-compose up -d

  # If WOLEET_ID_SERVER_ENCRYPTION_SECRET it not set, attaching to the server's container to enter it via CLI
  if [ -z $WOLEET_ID_SERVER_ENCRYPTION_SECRET ]; then
    local server=$(docker ps | grep woleetid-server_wid-server_1 | cut -d' ' -f 1)

    if [ "$server" == "$old_server" ]; then
      echo "Server was already running, nothing to do."
      exit 0
    fi

    echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
    docker attach $server --detach-keys='ctrl-c'
  fi
}

backup() {
  if [[ $# -ne 1 ]]
  then
    echo "usage: $0 backup <folder used to store backups>"
    exit 1
  fi

  BACKUP_PATH="$1"
  if [[ -d $BACKUP_PATH ]]; then
    echo "Create dump_$(date +%d-%m-%Y"_"%H_%M_%S).sql in $BACKUP_PATH."
    docker exec woleetid-server_wid-postgres_1 pg_dumpall -c -U postgres -h /var/run/postgresql >"$BACKUP_PATH/dump_$(date +%Y-%m-%d_%H_%M_%S).sql"
  else
    echo "This path does not exist!"
  fi
}

restore() {
  if [[ $# -ne 1 ]]
  then
    echo "usage: $0 restore <file to restore>.sql"
    exit 1
  fi

  RESTORE_FILE="$1"
  if [[ ${RESTORE_FILE##*.} == sql ]]; then
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "REVOKE CONNECT ON DATABASE wid FROM ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${WOLEET_ID_SERVER_POSTGRES_DB:-wid}' AND pid <> pg_backend_pid();"
    docker exec -i woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql < "$RESTORE_FILE"
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "GRANT CONNECT ON DATABASE wid TO ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    if [[ $(docker ps -q --filter name=woleetid-server_wid-server_1 --filter status=running | wc -w) -eq 1 ]]; then
      docker restart woleetid-server_wid-server_1
    fi
  else
    echo "${RESTORE_FILE} is not a dump file"
  fi
}

operation=$1

if [ -z $operation ]; then
  display_usage_app
  exit 1
fi

shift

if [ "$operation" == "start" ]; then
  start
elif [ "$operation" == "logs" ]; then
  docker-compose logs -f --tail 50
elif [ "$operation" == "stop" ]; then
  docker-compose down
elif [ "$operation" == "restart" ]; then
  docker-compose down
  start
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
  cd client
  docker build -f Dockerfile.builder -t wid-client-builder .
  cd ..
  echo "Done."

  echo "Compiling client source (wid-client-build)..."
  cd client
  docker build -f Dockerfile.build -t wid-client-build .
  cd ..
  echo "Done."

  echo "Copying client source to final image (wid-client)..."
  cd client
  docker build -f Dockerfile -t wid-client .
  cd ..
  echo "Done."

  echo "Building server builder image (wid-server-builder)..."
  cd server
  docker build -f Dockerfile.builder -t wid-server-builder .
  cd ..
  echo "Done."

  echo "Compiling server source (wid-server-build)..."
  cd server
  docker build -f Dockerfile.build -t wid-server-build .
  cd ..
  echo "Done."

  echo "Copying server source to final image (wid-server)..."
  cd server
  docker build -f Dockerfile -t wid-server .
  cd ..
  echo "Done."

  postbuild

  registry=${WOLEET_ID_SERVER_REGISTRY:-woleet-id-server}

  echo "Successfully built all images, associating them to repository \"${registry}\""

  docker tag wid-server ${registry}:server

  docker tag wid-client ${registry}:client

  echo "Done."
elif [ "$operation" == "backup" ]; then
  backup "$@"
elif [ "$operation" == "restore" ]; then
  restore "$@"
else
  display_usage_app
  exit 1
fi
