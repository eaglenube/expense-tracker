#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
npx sequelize-cli db:migrate

if [ "${SEED_ON_START}" = "true" ]; then
  echo "[entrypoint] Running database seeders..."
  npx sequelize-cli db:seed:all || echo "[entrypoint] Seeders skipped (already applied or failed)"
fi

echo "[entrypoint] Starting application..."
exec "$@"
