#!/usr/bin/env bash

set -e

if [[ -f configuration.sh ]]
then
  source configuration.sh
fi

CLIENT_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/client:${WOLEET_ID_SERVER_VERSION:-latest}"
SERVER_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/server:${WOLEET_ID_SERVER_VERSION:-latest}"
export WOLEET_ID_SERVER_API_VERSION="$(cat swagger.yaml | grep 'version' | grep -oE '([[:digit:]]+.?)+')"

display_usage_app() {
  echo "usage: $0 [start|stop|restart|build|push|check|logs|backup|restore|upgrade|ha-start|ha-stop|ha-restart]"
}

start-local() {
  local old_server
  old_server=$(docker ps | grep "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-server_1" | cut -d' ' -f 1)
  docker-compose -f docker-compose.yml -f docker-compose.local.yml --project-name "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" up -d

  # If WOLEET_ID_SERVER_ENCRYPTION_SECRET it not set, attaching to the server's container to enter it via CLI
  if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
  then
    local server
    server=$(docker ps | grep "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-server_1" | cut -d' ' -f 1)

    if [ "$server" == "$old_server" ]
    then
      echo "Server was already running, nothing to do."
      exit 0
    fi

    echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
    docker attach "$server" --detach-keys='ctrl-c'
  fi
}

start-ha() {
  check-manager-node-ha

  if ! docker secret inspect encryption-secret > /dev/null 2>&1
  then
    create-secret-ha
  fi
  docker stack deploy --prune -c docker-compose.yml -c docker-compose.ha.yml "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}"
}

stop-local() {
  docker-compose -f docker-compose.yml -f docker-compose.local.yml --project-name "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" down
}

stop-ha() {
  echo "Stopping ${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server} stack..."
  until docker stack rm "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" 2>&1 | grep "Nothing"
  do
    echo "Waiting for stack to shutdown..."
    sleep 1
  done
  echo "Stack successfully shutdown"
}

check-manager-node-ha() {
  if [[ "$(docker info -f '{{.Swarm.LocalNodeState}}')" != "active" ]]
  then
    echo "This node is not in an active swarm cluster, exiting"
    exit 1
  fi

  if [[ "$(docker info --format '{{.Swarm.ControlAvailable}}')" != "true" ]]
  then
    echo "Node is not a manager, this script needs to be run on a manager node, exiting"
    exit 1
  fi
}

create-secret-ha() {
  local secret
  local confirmSecret
  if [[ -n "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
  then
    echo "Secret is created from WOLEET_ID_SERVER_ENCRYPTION_SECRET"
    secret="${WOLEET_ID_SERVER_ENCRYPTION_SECRET}"
  else
    echo "WOLEET_ID_SERVER_ENCRYPTION_SECRET is not defined, you will now be asked to create a secret"
    while [[ -z "${secret}" ]] || [[ -z "${confirmSecret}" ]] || [[ "${secret}" != "${confirmSecret}" ]]
    do
      stty -echo
      printf "Encryption secret: "
      read -r secret
      printf "\n"
      printf "Confirm secret: "
      read -r confirmSecret
      stty echo

      if [[ "${secret}" != "${confirmSecret}" ]]
      then
        echo "Inputs are differents, please reconfirm secret."
      elif [[ -z "${secret}" ]] || [[ -z "${confirmSecret}" ]]
      then
        echo "Secret can't be void, please enter a new one."
      else
        echo ""
      fi
    done
  fi

  local hash="$(echo "$secret" | cksum | cut -d' ' -f1)"
  echo "$secret" | docker secret create --label hash="$hash" encryption-secret -
}

update-secret-ha() {
  if docker stack ps -q "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" > /dev/null 2>&1
  then
    echo "Please stop the ${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server} stack before running this command again"
    echo "You can do it by doing: ./app.sh stop-ha"
    exit 1
  fi

  delete-secret
  create-secret
  echo "Encryption secret has been updated, you can now (re)start Woleet.ID Server"
}

delete-secret() {
  docker secret rm encryption-secret
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
    docker exec "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" pg_dumpall -c -U postgres -h /var/run/postgresql >"$BACKUP_PATH/dump_$(date +%Y-%m-%d_%H_%M_%S).sql"
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
    docker exec "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" psql -U postgres -h /var/run/postgresql -c "REVOKE CONNECT ON DATABASE wid FROM ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    docker exec "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" psql -U postgres -h /var/run/postgresql -c "SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${WOLEET_ID_SERVER_POSTGRES_DB:-wid}' AND pid <> pg_backend_pid();"
    docker exec -i "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" psql -U postgres -h /var/run/postgresql < "$RESTORE_FILE"
    docker exec "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" psql -U postgres -h /var/run/postgresql -c "GRANT CONNECT ON DATABASE wid TO ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    if [[ $(docker ps -q --filter name="${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1" --filter status=running | wc -w) -eq 1 ]]; then
      docker restart "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-postgres_1"
      if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
      then
        echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
        docker attach "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_wid-server_1" --detach-keys='ctrl-c'
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
  start-local
elif [[ "$operation" == "ha-start" ]]
then
  check-manager-node-ha
  start-ha
elif [[ "$operation" == "logs" ]]
then
  docker-compose -f docker-compose.yml -f docker-compose.local.yml --project-name "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" logs -f --tail 50
elif [[ "$operation" == "stop" ]]
then
  stop-local
elif [[ "$operation" == "ha-stop" ]]
then
  check-manager-node-ha
  stop-ha
elif [[ "$operation" == "restart" ]]
then
  stop-local
  start-local
elif [[ "$operation" == "ha-restart" ]]
then
  check-manager-node-ha
  stop-ha
  start-ha
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
elif [[ "$operation" == "upgrade" ]]
then
  git fetch
  if git describe --tags --exact-match HEAD > /dev/null 2>&1
  then
    CURRENT_TAG=$(git describe --tags --exact-match HEAD)
    LATEST_TAG=$(git tag | grep -E '^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+$' | sort | tail -n 1)
    if [[ "$CURRENT_TAG" != "$LATEST_TAG" ]]
    then
      CLIENT_STATUS="$(curl --silent -f -lSL "https://hub.docker.com/v2/repositories/${WOLEET_ID_SERVER_REGISTRY:-wids}/client/tags/${LATEST_TAG}" > /dev/null 2>&1; echo "$?")"
      SERVER_STATUS="$(curl --silent -f -lSL "https://hub.docker.com/v2/repositories/${WOLEET_ID_SERVER_REGISTRY:-wids}/server/tags/${LATEST_TAG}" > /dev/null 2>&1; echo "$?")"
      if [[ "$CLIENT_STATUS" == "0" ]] && [[ "$SERVER_STATUS" == "0" ]]
      then
        git checkout "$LATEST_TAG"
        touch configuration.sh
        if cat configuration.sh | grep "WOLEET_ID_SERVER_VERSION" > /dev/null 2>&1
        then
          ex +g/WOLEET_ID_SERVER_VERSION/d -cwq configuration.sh
        fi
        printf "%s\n" "export WOLEET_ID_SERVER_VERSION='$LATEST_TAG'" >> configuration.sh
      else
        echo "Images linked to the latest version are not built/pushed yet, please wait before attending to upgrade again"
        exit 0
      fi
    else
      echo "You are already on the latest version"
      exit 0
    fi
  else
    echo "No tag match your actual commit"
    echo "if you want to use the upgrade script is it necessary to checkout a tagged commit"
    echo "if not, you will always use the 'latest' docker image available on your computer"
    exit 1
  fi
elif [[ "$operation" == "test" ]]
then
  create-secret-ha "$@"
else
  display_usage_app
  exit 1
fi
