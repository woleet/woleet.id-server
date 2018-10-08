#!/usr/bin/env bash
# Use this script to start PostgreSQL as a standalone/non-persitent DB for tests (using Docker).
# ==============================================================================================

set -e

docker run \
  --name pg-dev \
  --rm \
  -p 5432:5432 \
  -e POSTGRES_DB=wid \
  -e POSTGRES_USER=pguser \
  -e POSTGRES_PASSWORD=pass \
  postgres:10.4-alpine
