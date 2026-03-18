\#!/usr/bin/env bash
set -euo pipefail

APP_DIR=~/devops-course-project
APP_NAME="shopsmart-server"

echo "=== ShopSmart Deployment ==="

cd "$APP_DIR"

echo ">> Pulling latest code..."
git pull origin main

nvm use 22

echo ">> Installing server dependencies..."
cd "$APP_DIR/server"
npm ci --production

echo ">> Building client..."
cd "$APP_DIR/client"
npm ci
npm run build

echo ">> Restarting server with PM2..."
cd "$APP_DIR/server"
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start src/index.js --name "$APP_NAME"
pm2 save

echo ""
echo "=== Deployment complete! ==="
echo "Server running as PM2 process: $APP_NAME"
pm2 status
