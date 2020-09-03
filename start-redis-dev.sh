#!/usr/bin/env bash
# Use this script to start Redis.
# ==============================================================================================

set -e

docker run $@ \
  --name woleetid-server_wid-redis_1 \
  --rm \
  -p 6379:6379 \
  redis:6.0-alpine
