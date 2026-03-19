#!/usr/bin/env bash
set -euo pipefail

APP_DIR=~/devops-course-project
APP_NAME="shopsmart-server"

echo "=== ShopSmart Deployment ==="

cd "$APP_DIR"

echo ">> Pulling latest code..."
git pull origin main

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm use 22

echo ">> Node version: $(node -v)"

# -------------------
# SERVER SETUP
# -------------------
echo ">> Installing server dependencies..."
cd "$APP_DIR/server"
npm i

# -------------------
# CLIENT BUILD
# -------------------
echo ">> Building client..."
cd "$APP_DIR/client"
npm ci
npm run build

# -------------------
# RESTART SERVER
# -------------------
echo ">> Restarting server with PM2..."
cd "$APP_DIR/server"

pm2 delete "$APP_NAME" 2>/dev/null || true

pm2 start src/index.js \
  --name "$APP_NAME" \
  --time

pm2 save

echo ""
echo "=== Deployment complete! ==="
pm2 status