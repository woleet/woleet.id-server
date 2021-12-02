#!/usr/bin/env bash
# Based on https://get.docker.com/

set -e

printPrerequisites() {
  if ! commandExists bash
  then
    echo "Please install bash before running this script"
    exit 1
  fi
  echo "Before installing Woleet.ID Server, please ensure that you have an SSL certificate and its key on this machine"
  echo "If you don't have one, please copy one and restart this installation script"
  local yn
  while true
  do
    read -r -n 1 -p "Would you like to continue? [y/n]" yn
    case $yn in
        [Yy]* ) echo ""; break;;
        [Nn]* ) echo ""; exit 0;;
        * ) echo ""; echo "Please answer y or n.";;
    esac
  done
}

commandExists() {
  command -v "$@" > /dev/null 2>&1
}

isVersionOK() {
  currentVersion=$(echo "$1" | grep -oE '([[:digit:]]\.?)+' )
  minimalVersion=$(echo "$2" | grep -oE '([[:digit:]]\.?)+' )

  if [ -z "$currentVersion" ]
  then
    return 1
  elif [ -z "$minimalVersion" ]
  then
    return 1
  fi

  if [ "$currentVersion" == "$minimalVersion" ]
  then
    return 0
  elif [ "$(printf "%s\n" "$currentVersion" "$minimalVersion" | sort -V | tail -n 1 )" == "$minimalVersion" ]
  then
    return 1
  fi
  return 0
}

installWids() {
  echo "Woleet.ID Server will be installed in $install_dir"
  if [ ! -d "$install_dir" ]
  then
    git clone https://github.com/woleet/woleet.id-server.git "$install_dir"
    cd "$install_dir"
  else
    cd "$install_dir"
    if ! git config --get remote.origin.url | grep "github.com/woleet/woleet.id-server" > /dev/null 2>&1
    then
      echo "Your already have a non empty directory $install_dir"
      echo "It does not contains our github repo, and this script is not able to handles that"
      echo "To fix this issue, either delete or rename your current $install_dir directory"
      exit 1
    fi
  fi

  LATEST_TAG="0.0.0"
  TAGS=($(git tag | grep -E '[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+' | sort --reverse --version-sort))
  for TAG in "${TAGS[@]}"
  do
    CLIENT_STATUS="$(curl --silent -f -lSL "https://hub.docker.com/v2/repositories/${WOLEET_ID_SERVER_REGISTRY:-wids}/client/tags/${TAG}" > /dev/null 2>&1; echo "$?")"
    SERVER_STATUS="$(curl --silent -f -lSL "https://hub.docker.com/v2/repositories/${WOLEET_ID_SERVER_REGISTRY:-wids}/server/tags/${TAG}" > /dev/null 2>&1; echo "$?")"
    if [[ "$CLIENT_STATUS" == "0" ]] && [[ "$SERVER_STATUS" == "0" ]]
    then
      LATEST_TAG="$TAG"
      break
    fi
  done

  if [[ "$LATEST_TAG" == "0.0.0" ]]
  then
    echo "There was an issue with the tag detection please rerun this script later"
    exit 1
  fi

  git checkout "$LATEST_TAG"
  touch configuration.sh

  if cat configuration.sh | grep "WOLEET_ID_SERVER_VERSION" > /dev/null 2>&1
  then
    ex +g/WOLEET_ID_SERVER_VERSION/d -cwq configuration.sh
  fi
  echo "export WOLEET_ID_SERVER_VERSION='$LATEST_TAG'" >> configuration.sh

}

getCheckSSLCerts() {
  local cerOK=false
  local keyOK=false
  local md5Checked=false
  local WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE
  local WOLEET_ID_SERVER_HTTP_TLS_KEY

  while [ "$md5Checked" == "false" ]
  do
    while [ "$cerOK" == "false" ]
    do
      read -r -e -p "Enter certificate filename, use tab for completion: " WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE
      if openssl x509 -noout -in "$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE")" > /dev/null 2>&1
      then
        WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE=$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE")
        cerOK=true
      else
        echo "The selected file is not a valid certificate, please select a valid certificate"
      fi
    done

    while [ "$keyOK" == "false" ]
    do
      read -r -e -p "Enter certificate key filename, use tab for completion: " WOLEET_ID_SERVER_HTTP_TLS_KEY
      if openssl rsa -noout -in "$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_KEY")" > /dev/null 2>&1
      then
        WOLEET_ID_SERVER_HTTP_TLS_KEY=$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_KEY")
        keyOK=true
      else
        echo "The selected file is not a valid certificate key, please select a valid certificate key"
      fi
    done

    md5Cert=$(openssl x509 -modulus -noout -in "$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE" | openssl md5)
    md5Key=$(openssl rsa -modulus -noout -in "$WOLEET_ID_SERVER_HTTP_TLS_KEY" | openssl md5)

    if [ "$md5Cert" == "$md5Key" ]
    then
      md5Checked=true
    else
      echo "The provided certificate and key does not match, please reselect a valid pair"
      cerOK=false
      keyOK=false
    fi
  done

  if cat configuration.sh | grep "WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE" > /dev/null 2>&1
  then
    ex +g/WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE/d -cwq configuration.sh
  fi
  echo "export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE='$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE'" >> configuration.sh

  if cat configuration.sh | grep "WOLEET_ID_SERVER_HTTP_TLS_KEY" > /dev/null 2>&1
  then
    ex +g/WOLEET_ID_SERVER_HTTP_TLS_KEY/d -cwq configuration.sh
  fi
  echo "export WOLEET_ID_SERVER_HTTP_TLS_KEY='$WOLEET_ID_SERVER_HTTP_TLS_KEY'" >> configuration.sh
}

install() {
  if [ "$(uname -m)" != 'x86_64' ]
  then
    echo 'Woleet.ID Server is not available on this architecture'
    exit 1
  fi

  printPrerequisites

  if ! commandExists readlink
  then
    echo 'Please install coreutils before rerunning this script'
    echo 'For debian based OS: sudo apt install coreutils'
    echo 'For fedora: sudo dnf install coreutils'
    echo 'For centos: sudo yum install coreutils'
    exit 1
  fi

  if ! commandExists curl
  then
    echo 'Please install curl before rerunning this script'
    echo 'For debian based OS: sudo apt install curl'
    echo 'For fedora: sudo dnf install curl'
    echo 'For centos: sudo yum install curl'
    exit 1
  fi

  if ! commandExists git
  then
    echo 'Please install git before rerunning this script'
    echo 'For debian based OS: sudo apt install git'
    echo 'For fedora: sudo dnf install git'
    echo 'For centos: sudo yum install git'
    exit 1
  fi

  if ! commandExists openssl
  then
    echo 'Please install openssl before rerunning this script'
    echo 'For debian based OS: sudo apt install openssl'
    echo 'For fedora: sudo dnf install openssl'
    echo 'For centos: sudo yum install openssl'
    exit 1
  fi

  if ! commandExists docker
  then
    echo 'Please install docker before rerunning this script'
    exit 1
  else

    #TODO check docker access
    if ! docker ps > /dev/null 2>&1
    then
      echo 'Docker does not seems to be configured correctly, you can check:'
      echo 'If the docker process is actually running'
      echo 'If the current user is a member of the "docker" linux group'
      exit 1
    fi

    dockerVersion="$(docker version --format '{{.Server.Version}}' 2> /dev/null | grep -oE '([[:digit:]]\.?)+')"
    if ! isVersionOK "$dockerVersion" "18.09.0"
    then
      echo 'Please upgrade your docker version to at least 18.09.0+ before rerunning this script'
      exit 1
    fi
  fi

  if ! commandExists docker-compose
  then
    echo 'Please install docker-compose before rerunning this script'
    exit 1
  else
    if ! isVersionOK "$(docker-compose version --short)" "1.22"
    then
      echo 'Please upgrade your docker-compose version to at least 1.22+ before rerunning this script'
      exit 1
    fi
  fi

  install_dir="${HOME}/wids"
  installWids
  getCheckSSLCerts

  if docker ps > /dev/null 2>&1
  then
  (
    cd "$install_dir"
    ./app.sh start
  )
  else
  (
    cd "$install_dir"
    sg docker "./app.sh start"
  )
  fi
}

install
