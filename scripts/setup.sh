#!/usr/bin/env bash

set -euo pipefail

echo "=== ShopSmart EC2 Setup ==="

mkdir -p ~/devops-course-project
mkdir -p ~/logs

if ! command -v node &>/dev/null; then
    echo ">> Node.js not found. Installing via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    nvm alias default 18
else
    echo ">> Node.js already installed: $(node -v)"
fi

if ! command -v pm2 &>/dev/null; then
    echo ">> Installing PM2 globally..."
    npm install -g pm2
else
    echo ">> PM2 already installed: $(pm2 -v)"
fi

if ! command -v git &>/dev/null; then
    echo ">> Installing Git..."
    sudo apt-get update -y && sudo apt-get install -y git
else
    echo ">> Git already installed: $(git --version)"
fi

if [ ! -d ~/devops-course-project/.git ]; then
    echo ">> Cloning repository..."
    git clone https://github.com/yashgoyal0110/devops-course-project.git ~/devops-course-project
else
    echo ">> Repository already cloned."
fi


if [ ! -f ~/devops-course-project/server/.env ]; then
    echo ">> Creating server .env file (fill in values manually)..."
    cat > ~/devops-course-project/server/.env <<EOF
PORT=5001
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
EOF
else
    echo ">> Server .env already exists."
fi

echo ">> Installing server dependencies..."
cd ~/devops-course-project/server
npm ci --production

echo ""
echo "=== Setup complete! ==="
echo "Next: Update server/.env with real values, then run scripts/deploy.sh"
