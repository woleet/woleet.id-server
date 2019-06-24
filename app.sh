#!/usr/bin/env bash

set -e

CLIENT_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/client:${WOLEET_ID_SERVER_VERSION:-latest}"
SERVER_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/server:${WOLEET_ID_SERVER_VERSION:-latest}"

display_usage_app() {
  echo "usage: $0 [start|stop|restart|build|push|check|logs|backup|restore]"
}

start() {
  local old_server
  old_server=$(docker ps | grep woleetid-server_wid-server_1 | cut -d' ' -f 1)
  docker-compose up -d

  # If WOLEET_ID_SERVER_ENCRYPTION_SECRET it not set, attaching to the server's container to enter it via CLI
  if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]
  then
    local server
    server=$(docker ps | grep woleetid-server_wid-server_1 | cut -d' ' -f 1)

    if [ "$server" == "$old_server" ]
    then
      echo "Server was already running, nothing to do."
      exit 0
    fi

    echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
    docker attach "$server" --detach-keys='ctrl-c'
  fi
}

backup() {
  if [[ $# -ne 1 ]]
  then
    echo "usage: $0 backup <folder used to store backups>"
    exit 1
  fi

  BACKUP_PATH="$1"
  if [[ -d $BACKUP_PATH ]]
  then
    echo "Create dump_$(date +%Y-%m-%d_%H_%M_%S).sql in $BACKUP_PATH."
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
  if [[ ${RESTORE_FILE##*.} == sql ]]
  then
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "REVOKE CONNECT ON DATABASE wid FROM ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${WOLEET_ID_SERVER_POSTGRES_DB:-wid}' AND pid <> pg_backend_pid();"
    docker exec -i woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql < "$RESTORE_FILE"
    docker exec woleetid-server_wid-postgres_1 psql -U postgres -h /var/run/postgresql -c "GRANT CONNECT ON DATABASE wid TO ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    if [[ $(docker ps -q --filter name=woleetid-server_wid-server_1 --filter status=running | wc -w) -eq 1 ]]; then
      docker restart woleetid-server_wid-server_1
      if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
      then
        echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
        docker attach woleetid-server_wid-server_1 --detach-keys='ctrl-c'
      fi
    fi
  else
    echo "${RESTORE_FILE} is not a dump file"
  fi
}

operation=$1

if [[ -z "$operation" ]]
then
  display_usage_app
  exit 1
fi

shift

if [[ "$operation" == "start" ]]
then
  start
elif [[ "$operation" == "logs" ]]
then
  docker-compose logs -f --tail 50
elif [[ "$operation" == "stop" ]]
then
  docker-compose down
elif [[ "$operation" == "restart" ]]
then
  docker-compose down
  start
elif [[ "$operation" == "push" ]]
then
  docker push "$CLIENT_IMAGE"
  docker push "$SERVER_IMAGE"
elif [[ "$operation" == "check" ]]
then
  cd server
  npm run lint
  npm run check
  cd ../client
  npm run lint
elif [[ "$operation" == "build" ]]
then
  echo "Build client image ($CLIENT_IMAGE)..."
  docker build -f Dockerfile.client -t "$CLIENT_IMAGE" .
  echo "Done."

  echo "Building server image ($SERVER_IMAGE)..."
  docker build -f Dockerfile.server -t "$SERVER_IMAGE" .
  echo "Done."
elif [[ "$operation" == "backup" ]]
then
  backup "$@"
elif [[ "$operation" == "restore" ]]
then
  restore "$@"
else
  display_usage_app
  exit 1
fi
