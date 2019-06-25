#!/usr/bin/env bash

set -e

command_exists() {
  command -v "$@" > /dev/null 2>&1
}

get_distribution() {
  lsb_dist=""
  # Every system that we officially support has /etc/os-release
  if [ -r /etc/os-release ]
  then
    lsb_dist="$(. /etc/os-release && echo "$ID")"
  fi
  # Returning an empty string here should be alright since the
  # case statements don't act unless you provide an actual value
  echo "$lsb_dist"
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
    if command_exists sudo
    then
      sh_c='sudo -E sh -c'
    elif command_exists su
    then
      sh_c='su -c'
    else
  printf '%s\n' '
Error: this installer needs the ability to run commands as root.
We are unable to find either "sudo" or "su" available to make this happen.'
      exit 1
    fi
  fi
}

setLsbVersionDist() {
  # perform some very rudimentary platform detection
  lsb_dist=""
  # Every system that we officially support has /etc/os-release
  if [ -r /etc/os-release ]
  then
    lsb_dist="$(. /etc/os-release && echo "$ID" | tr '[:upper:]' '[:lower:]' )"
  fi

  # Run setup for each distro accordingly
  case "$lsb_dist" in
    ubuntu|debian)
      if [ "$lsb_dist" = "ubuntu" ]
      then
        if command_exists lsb_release
        then
          dist_version="$(lsb_release --codename | cut -f2)"
        fi
        if [ -z "$dist_version" ] && [ -r /etc/lsb-release ]
        then
          dist_version="$(. /etc/lsb-release && echo "$DISTRIB_CODENAME")"
        fi
      fi

      if [ "$lsb_dist" = "debian" ]
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
      if [ "$lsb_dist" = "fedora" ]
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
      if [ "$lsb_dist" = "fedora" ]
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
}

startEnableDocker() {
  (
    set -x
    $sh_c 'systemctl daemon-reload; systemctl start docker; systemctl enable docker'
  )
}

installDockerCompose() {
  (
    set -x
    $sh_c "curl -fsSL \"https://github.com/docker/compose/releases/download/1.24.0/docker-compose-Linux-x86_64\" -o /usr/local/bin/docker-compose"
    $sh_c "chmod +x /usr/local/bin/docker-compose"
  )
}

installWids() {
  install_dir="${HOME}/wids"
  echo "Wids will be installed in $install_dir"
  if [ ! -d "$install_dir" ]
  then
    git clone https://github.com/woleet/woleet.id-server.git "$install_dir"
    cd "$install_dir"
  else
    cd "$install_dir"
    git fetch
  fi
  LATEST_TAG=$(git tag | grep -E '[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+' | sort | tail -n 1)
  git checkout "$LATEST_TAG"
}

install() {
  if [ "$(uname -m)" != 'x86_64' ]
  then
    echo "WIDS is not available on this architecture"
    exit 1
  fi

  setShC
  setLsbVersionDist

  if ! command_exists bash
  then
    installPackage bash
  fi

  if ! command_exists curl
  then
    installPackage curl
  fi

  if ! command_exists git
  then
    installPackage git
  fi

  if ! command_exists docker
  then
    installDocker
    startEnableDocker
    (
      set -x
      $sh_c "usermod -aG docker $USER"
    )
    # TODO (Creates a new shell T_T)
    # newgrp docker
  elif ! isVersionOK "$(docker version --format '{{.Server.Version}}' | grep -E '([[:digit:]]\.?)+' )" "17.09.0"
  then
    echo "Please upgrade your docker version to at least 17.09.0+ before rerunning this script"
    exit 1
  fi

  if ! command_exists docker-compose
  then
    installDockerCompose
  elif ! isVersionOK "$(docker-compose version --short)" "1.17"
  then
    echo "Please upgrade your docker-compose version to at least 1.17+ before rerunning this script"
    exit 1
  fi

  exit 0

  installWids
  # Configure
  export WOLEET_ID_SERVER_ENCRYPTION_SECRET='secret'
  #export WOLEET_ID_SERVER_DATA_DIR
  export WOLEET_ID_SERVER_HTTP_TLS_CERTIFICATE="$HOME/ssl/woleet.crt"
  export WOLEET_ID_SERVER_HTTP_TLS_KEY="$HOME/ssl/woleet.key"
  export WOLEET_ID_SERVER_VERSION="latest"
  # Start
  (
    set -x
    $sh_c "./app.sh start"
  )

  echo "You will have to log out and back to be able to interact with app.sh and docker"
}

# wrapped up in a function so that we have some protection against only getting
# half the file during "curl | sh"
install
