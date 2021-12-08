#!/usr/bin/env bash

set -e

if [[ -f configuration.sh ]]
then
  source configuration.sh
fi

CLIENT_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/client:${WOLEET_ID_SERVER_VERSION:-latest}"
SERVER_IMAGE="${WOLEET_ID_SERVER_REGISTRY:-wids}/server:${WOLEET_ID_SERVER_VERSION:-latest}"

display_usage_app() {
  echo "usage: $0 [start|stop|restart|build|push|check|logs|backup|restore|upgrade|ha-start|ha-stop|ha-restart|create-secret-ha|delete-secret-ha|update-secret-ha]"
}

start-local() {
  local old_server
  old_server=$(docker-compose -f docker-compose.yml -f docker-compose.local.yml ps --quiet wid-server || true)
  docker-compose -f docker-compose.yml -f docker-compose.local.yml --project-name "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" up -d

  # If WOLEET_ID_SERVER_ENCRYPTION_SECRET it not set, attaching to the server's container to enter it via CLI
  if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
  then
    local server
    server=$(docker-compose -f docker-compose.yml -f docker-compose.local.yml ps --quiet wid-server)

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
  if ! [[ -x "$(command -v openssl)" ]]
  then
    echo 'openssl either not installed or not found in your path, please install it before rerunning this script'
    exit 1
  fi

  check-manager-node-ha

  if ! docker secret inspect "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_encryption-secret" > /dev/null 2>&1
  then
    create-secret-ha
  fi

  if [[ -z "$WOLEET_ID_SERVER_COOKIE_KEY" ]]
  then
    WOLEET_ID_SERVER_COOKIE_KEY="$(openssl rand -base64 16)"
  fi

  if [[ -z "$WOLEET_ID_SERVER_OIDC_KEY" ]]
  then
    WOLEET_ID_SERVER_OIDC_KEY="$(openssl genrsa 2048 2> /dev/null)"
  fi

  WOLEET_ID_SERVER_COOKIE_KEY="$WOLEET_ID_SERVER_COOKIE_KEY" \
  WOLEET_ID_SERVER_OIDC_KEY="$WOLEET_ID_SERVER_OIDC_KEY" \
  docker stack deploy --prune -c docker-compose.yml -c docker-compose.ha.yml "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" "$@"
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

  echo "$secret" | docker secret create "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_encryption-secret" -
}

update-secret-ha() {
  if docker stack ps -q "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" > /dev/null 2>&1
  then
    echo "Please stop the ${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server} stack before running this command again"
    echo "You can do it by doing: ./app.sh stop-ha"
    exit 1
  fi

  delete-secret-ha
  create-secret-ha
  echo "Encryption secret has been updated, you can now (re)start Woleet.ID Server"
}

delete-secret-ha() {
  docker secret rm "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}_encryption-secret"
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
    docker-compose -f docker-compose.yml -f docker-compose.local.yml exec wid-postgres pg_dumpall -c -U postgres -h /var/run/postgresql >"$BACKUP_PATH/dump_$(date +%Y-%m-%d_%H_%M_%S).sql"
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
    postgres_docker_id=$(docker-compose -f docker-compose.yml -f docker-compose.local.yml ps --quiet wid-postgres)
    docker exec "$postgres_docker_id" psql -U postgres -h /var/run/postgresql -c "REVOKE CONNECT ON DATABASE wid FROM ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    docker exec "$postgres_docker_id" psql -U postgres -h /var/run/postgresql -c "SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${WOLEET_ID_SERVER_POSTGRES_DB:-wid}' AND pid <> pg_backend_pid();"
    docker exec -i "$postgres_docker_id" psql -U postgres -h /var/run/postgresql < "$RESTORE_FILE"
    docker exec "$postgres_docker_id" psql -U postgres -h /var/run/postgresql -c "GRANT CONNECT ON DATABASE wid TO ${WOLEET_ID_SERVER_POSTGRES_USER:-pguser};"
    docker-compose -f docker-compose.yml -f docker-compose.local.yml restart wid-postgres
    docker-compose -f docker-compose.yml -f docker-compose.local.yml restart wid-server
    if [[ -z "$WOLEET_ID_SERVER_ENCRYPTION_SECRET" ]]
    then
      echo "No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, attaching to container ${server}..."
      docker attach $(docker-compose -f docker-compose.yml -f docker-compose.local.yml ps --quiet wid-server) --detach-keys='ctrl-c'
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
  start-ha "$@"
elif [[ "$operation" == "logs" ]]
then
  docker-compose -f docker-compose.yml -f docker-compose.local.yml --project-name "${WOLEET_ID_SERVER_PROJECT_NAME:-woleetid-server}" logs -f --tail 50
elif [[ "$operation" == "stop" ]]
then
  stop-local
elif [[ "$operation" == "ha-stop" ]]
then
  stop-ha
elif [[ "$operation" == "restart" ]]
then
  stop-local
  start-local
elif [[ "$operation" == "ha-restart" ]]
then
  stop-ha
  start-ha
elif [[ "$operation" == "ha-create-secret" ]]
then
create-secret-ha
elif [[ "$operation" == "ha-delete-secret" ]]
then
delete-secret-ha
elif [[ "$operation" == "ha-update-secret" ]]
then
update-secret-ha
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
  echo "Building client image ($CLIENT_IMAGE)..."
  docker build -f Dockerfile.client -t "$CLIENT_IMAGE" .
  echo "Done."
  echo "Building server image ($SERVER_IMAGE)..."
  docker build -f Dockerfile.server -t "$SERVER_IMAGE" --build-arg WOLEET_ID_SERVER_API_VERSION_BUILDTIME="$(cat swagger.yaml | grep 'version' | grep -oE '([[:digit:]]+.?)+')" .
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
    LATEST_TAG=$(git tag | grep -E '^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+$' | sort --version-sort | tail -n 1)
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
else
  display_usage_app
  exit 1
fi
