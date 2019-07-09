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

setShC() {
  user="$(id -un 2>/dev/null || true)"

  sh_c='sh -c'
  if [ "$user" != 'root' ]
  then
    if commandExists sudo
    then
      sh_c='sudo -E sh -c'
    elif commandExists su
    then
      sh_c='su -c'
    else
      echo 'Error: this installer needs the ability to run commands as root.'
      echo 'We are unable to find either "sudo" or "su" available to make this happen.'
      exit 1
    fi
  fi
}

setLsbVersionDist() {
  lsb_dist=""
  if [ -r /etc/os-release ]
  then
    lsb_dist="$(. /etc/os-release && echo "$ID" | tr '[:upper:]' '[:lower:]' )"
  fi

  case "$lsb_dist" in
    ubuntu|debian)
      if [ "$lsb_dist" == "ubuntu" ]
      then
        if commandExists lsb_release
        then
          dist_version="$(lsb_release --codename | cut -f2)"
        fi
        if [ -z "$dist_version" ] && [ -r /etc/lsb-release ]
        then
          dist_version="$(. /etc/lsb-release && echo "$DISTRIB_CODENAME")"
        fi
      fi

      if [ "$lsb_dist" == "debian" ]
      then
        dist_version="$(sed 's/\/.*//' /etc/debian_version | sed 's/\..*//')"
        case "$dist_version" in
          9)
            dist_version="stretch"
          ;;
          8)
            dist_version="jessie"
          ;;
        esac
      fi
      ;;
    centos|fedora)
      ;;
      *)
        echo "this script is not available on this OS"
        exit 1
      ;;
  esac
}

installPackage() {
  setShC
  package=$1
  case "$lsb_dist" in
    ubuntu|debian)
      (
        set -x
        $sh_c 'apt-get update -qq > /dev/null 2>&1'
        $sh_c "apt-get install -y -qq $package > /dev/null 2>&1"
      )
      ;;
    centos|fedora)
      if [ "$lsb_dist" == "fedora" ]
      then
        pkg_manager="dnf"
      else
        pkg_manager="yum"
      fi
      (
        set -x
        $sh_c "$pkg_manager install -y -q $package"
      )
      ;;
    *)
      echo "this script is not available on this OS"
      exit 1
      ;;
  esac
}

installDocker() {
  setShC
  case "$lsb_dist" in
    ubuntu|debian)
      pre_reqs="apt-transport-https ca-certificates"
      if ! command -v gpg > /dev/null 2>&1
      then
        pre_reqs="$pre_reqs gnupg"
      fi
      apt_repo="deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/$lsb_dist $dist_version stable"
      (
        set -x
        $sh_c 'apt-get update -qq > /dev/null 2>&1'
        $sh_c "apt-get install -y -qq $pre_reqs > /dev/null 2>&1"
        $sh_c "curl -fsSL \"https://download.docker.com/linux/$lsb_dist/gpg\" | apt-key add -qq - > /dev/null 2>&1"
        $sh_c "echo \"$apt_repo\" > /etc/apt/sources.list.d/docker.list"
        $sh_c 'apt-get update -qq > /dev/null 2>&1'
        $sh_c "apt-get install -y -qq --no-install-recommends docker-ce > /dev/null 2>&1"
      )
      ;;
    centos|fedora)
      yum_repo="https://download.docker.com/linux/$lsb_dist/docker-ce.repo"
      if ! curl -Ifs "$yum_repo" > /dev/null 2>&1
      then
        echo "Error: Unable to curl repository file $yum_repo, is it valid?"
        exit 1
      fi
      if [ "$lsb_dist" == "fedora" ]
      then
        pkg_manager="dnf"
        config_manager="dnf config-manager"
        enable_channel_flag="--set-enabled"
        disable_channel_flag="--set-disabled"
        pre_reqs="dnf-plugins-core"
      else
        pkg_manager="yum"
        config_manager="yum-config-manager"
        enable_channel_flag="--enable"
        disable_channel_flag="--disable"
        pre_reqs="yum-utils"
      fi
      (
        set -x
        $sh_c "$pkg_manager install -y -q $pre_reqs"
        $sh_c "$config_manager --add-repo $yum_repo"

        $sh_c "$config_manager $disable_channel_flag docker-ce-*"
        $sh_c "$config_manager $enable_channel_flag docker-ce-stable"

        $sh_c "$pkg_manager makecache"
        $sh_c "$pkg_manager install -y -q docker-ce"
      )
      ;;
    *)
      echo "this script is not available on this OS"
      exit 1
      ;;
  esac

  if [ "$user" != 'root' ]
  then
    (
      set -x
      $sh_c "usermod -aG docker $user"
    )
    echo "Your user: $user has been added to the docker group so that you can user app.sh without sudo"
    echo "WARNING! depending on your configuration you may not want it as it can provides root access as described here:"
    echo "https://docs.docker.com/engine/security/security/#docker-daemon-attack-surface"
    echo "You will have to log out and back to be able to interact with app.sh and docker without sudo or sg"
    local confirm
    while true
    do
      read -r -n 1 -p "Please type [y] to continue after reading the warning above " confirm
      case $confirm in
          [Yy]* ) echo ""; break;;
          * ) echo ""; echo "Please type y";;
      esac
    done
  fi
}

startEnableDocker() {
  setShC
  (
    set -x
    $sh_c 'systemctl daemon-reload; systemctl start docker; systemctl enable docker'
  )
}

installDockerCompose() {
  setShC
  (
    set -x
    $sh_c "curl -fsSL \"https://github.com/docker/compose/releases/download/1.24.0/docker-compose-Linux-x86_64\" -o /usr/local/bin/docker-compose"
    $sh_c "chmod +x /usr/local/bin/docker-compose"
  )
}

installWids() {
  echo "Woleet.ID Server will be installed in $install_dir"
  if [ ! -d "$install_dir" ]
  then
    git clone https://github.com/woleet/woleet.id-server.git "$install_dir"
    cd "$install_dir"
  else
    if git -C "$install_dir" config --get remote.origin.url | grep "github.com/woleet/woleet.id-server" > /dev/null 2>&1
    then
      cd "$install_dir"
      git fetch
    else
      echo "Your already have a non empty directory $install_dir"
      echo "It does not contains our github repo, and this script is not able to handles that"
      echo "To fix this issue, either delete or rename your current $install_dir directory"
      exit 1
    fi
  fi
  LATEST_TAG=$(git tag | grep -E '[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+' | sort | tail -n 1)
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

  while [ "$md5Checked" == "false" ]
  do
    while [ "$cerOK" == "false" ]
    do
      read -r -e -p "Enter certificate filename, use tab for completion: " WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE
      WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE=$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE")
      if openssl x509 -noout -in "$WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE" > /dev/null 2>&1
      then
        cerOK=true
      else
        echo "The selected file is not a valid certificate, please select a valid certificate"
      fi
    done

    while [ "$keyOK" == "false" ]
    do
      read -r -e -p "Enter certificate key filename, use tab for completion: " WOLEET_ID_SERVER_HTTP_TLS_KEY
      WOLEET_ID_SERVER_HTTP_TLS_KEY=$(readlink -f "$WOLEET_ID_SERVER_HTTP_TLS_KEY")
      if openssl rsa -noout -in "$WOLEET_ID_SERVER_HTTP_TLS_KEY" > /dev/null 2>&1
      then
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
    echo "Woleet.ID Server is not available on this architecture"
    exit 1
  fi

  printPrerequisites

  setLsbVersionDist

  if ! commandExists readlink
  then
    installPackage coreutils
  fi

  if ! commandExists curl
  then
    installPackage curl
  fi

  if ! commandExists git
  then
    installPackage git
  fi

  if ! commandExists openssl
  then
    installPackage openssl
  fi

  if [ "$user" != 'root' ]
  then
    if ! commandExists sg
    then
      case "$lsb_dist" in
        ubuntu|debian)
          installPackage login
          ;;
        centos|fedora)
          installPackage shadow-utils
          ;;
      esac
    fi
  fi

  if ! commandExists docker
  then
    installDocker
    startEnableDocker
  else
    if docker ps > /dev/null 2>&1
    then
      dockerVersion="$(docker version --format '{{.Server.Version}}' 2> /dev/null | grep -oE '([[:digit:]]\.?)+')"
    else
      dockerVersion="$(sg docker "docker version --format '{{.Server.Version}}'" 2> /dev/null | grep -oE '([[:digit:]]\.?)+')"
    fi
    if ! isVersionOK "$dockerVersion" "17.09.0"
    then
      echo "Please upgrade your docker version to at least 17.09.0+ before rerunning this script"
      exit 1
    fi
  fi

  if ! commandExists docker-compose
  then
    installDockerCompose
  elif ! isVersionOK "$(docker-compose version --short)" "1.17"
  then
    echo "Please upgrade your docker-compose version to at least 1.17+ before rerunning this script"
    exit 1
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
