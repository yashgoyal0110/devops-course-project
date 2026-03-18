# 🛒 ShopSmart – DevOps-Ready E-Commerce Application

A full-stack e-commerce platform built with **React** and **Express**, demonstrating modern DevOps practices including CI/CD pipelines, automated testing, linting, dependency management, and infrastructure-as-code deployment.

---

## 📐 Architecture

```
┌──────────────────┐       ┌──────────────────┐       ┌─────────────┐
│   React (Vite)   │──────▶│  Express API     │──────▶│  MongoDB    │
│   Frontend       │ HTTP  │  Backend         │       │  Atlas      │
│   Port 5173      │◀──────│  Port 5001       │◀──────│             │
└──────────────────┘       └──────────────────┘       └─────────────┘
        │                          │
        ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│  Vercel          │       │  Render / EC2    │
│  (Frontend Host) │       │  (Backend Host)  │
└──────────────────┘       └──────────────────┘
```

### Client (React + Vite)
- **Pages**: Home, Products, ProductDetail, Cart, Checkout, Orders, Login, Register
- **Components**: Navbar, Footer, ProductCard, Loader, ProtectedRoute
- **State**: React Context API for Auth & Cart management
- **Routing**: React Router v6 with protected routes

### Server (Express + MongoDB)
- **RESTful API**: Auth, Products, Categories, Cart, Orders
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Middleware**: Token verification, role-based access control
- **Database**: MongoDB with Mongoose ODM

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | React 18, Vite 5, React Router v6  |
| Backend        | Express 4, Node.js 18              |
| Database       | MongoDB Atlas, Mongoose 8          |
| Testing        | Jest, Supertest, Vitest, Testing Library, Playwright |
| CI/CD          | GitHub Actions                      |
| Linting        | ESLint 8, Prettier                  |
| Infrastructure | Terraform, Docker, AWS EC2          |
| Deployment     | Render (backend), Vercel (frontend) |
| Process Mgmt   | PM2 (EC2 production)                |

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push & PR to main/develop | Install deps, lint, run tests (both client & server) |
| `lint.yml` | PR only | Strict lint checks – fails on any warning |
| `deploy.yml` | Push to main | SSH into EC2, pull code, run deploy script |

### Pipeline Flow

```
Push/PR → Install Deps → Lint → Unit Tests → Integration Tests
                                                    ↓
                                          (main only) Deploy to EC2
```

---

## 🧪 Testing Strategy

### Unit Tests (Server – Jest)
- **`app.test.js`** – Health endpoint, root route, unknown routes
- **`auth.test.js`** – JWT generation/verification, middleware rejection
- **`product.test.js`** – Product listing, single product, 404 handling

### Integration Tests (Server – Jest + Supertest)
- **`integration.test.js`** – Full auth flow: register → login → protected route access

### Unit Tests (Client – Vitest + Testing Library)
- **`App.test.jsx`** – Root app renders correctly
- **`Navbar.test.jsx`** – Brand display, auth state, cart badge, navigation
- **`ProductCard.test.jsx`** – Price formatting, discount badge, addToCart
- **`Footer.test.jsx`** – Sections, links, copyright year

### E2E Tests (Client – Playwright)
- **`home.spec.js`** – Page navigation, login form, cart access

### Running Tests

```bash
# Server tests
cd server && npm test

# Client unit tests
cd client && npm test -- --run

# Client E2E tests (requires Playwright install)
cd client && npx playwright install && npm run test:e2e
```

---

## 🔍 Linting (PR Checks)

- **Server**: ESLint with `eslint:recommended` rules, Node.js + Jest environments
- **Client**: ESLint with React, React Hooks, and React Refresh plugins
- **Formatting**: Prettier config (single quotes, semicolons, 2-space tabs)

PRs trigger a strict lint workflow that **fails if any warnings exist**, preventing low-quality code from merging.

```bash
# Run linters locally
cd server && npm run lint
cd client && npm run lint
```

---

## 🤖 Dependabot

Auto-detects outdated dependencies via `.github/dependabot.yml`:
- **Client npm** packages – weekly checks
- **Server npm** packages – weekly checks
- **GitHub Actions** versions – weekly checks

PRs are auto-labeled (`frontend`, `backend`, `ci`) for easy triage.

---

## ☁️ EC2 Deployment

### Setup (one-time)

1. Provision EC2 with Terraform:
   ```bash
   terraform init && terraform apply
   ```
2. Run the idempotent setup script on the instance:
   ```bash
   bash scripts/setup.sh
   ```
3. Configure GitHub Secrets:
   - `EC2_HOST` – EC2 public IP
   - `EC2_USER` – SSH username (e.g., `ubuntu`)
   - `EC2_SSH_KEY` – Private SSH key contents

### Automated Deployment

On push to `main`, the `deploy.yml` workflow SSHes into EC2 and runs `scripts/deploy.sh`, which:
1. Pulls latest code (`git pull` – idempotent)
2. Installs dependencies (`npm ci` – deterministic)
3. Builds the client (`npm run build` – overwrites `dist/`)
4. Restarts the server via PM2 (`pm2 delete || true; pm2 start` – idempotent)

---

## 📜 Idempotent Scripts

| Script | Purpose | Idempotent Patterns |
|--------|---------|---------------------|
| `scripts/setup.sh` | Initial EC2 setup | `mkdir -p`, `command -v` checks, `[ ! -f ]` guards |
| `scripts/deploy.sh` | Deploy latest code | `git pull`, `npm ci`, `pm2 delete \|\| true` |

Both scripts can be **safely run multiple times** without side effects.

---

## 🏗️ Infrastructure (Terraform)

The `ec2.tf` + `variables.tf` files provision:
- AWS EC2 instance (t3.micro, gp3 SSD)
- Security group allowing SSH (22) and HTTP (80)
- SSH key pair for deployment

---

## 📁 Project Structure

```
devops-course-project/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline
│   │   ├── lint.yml            # PR lint checks
│   │   └── deploy.yml          # EC2 deployment
│   └── dependabot.yml          # Dependency updates
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth & Cart contexts
│   │   ├── pages/              # Route pages
│   │   └── App.jsx             # Root component
│   ├── e2e/                    # Playwright E2E tests
│   ├── playwright.config.js
│   └── vite.config.js
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── app.js              # Express app setup
│   │   └── index.js            # Server entry point
│   ├── tests/                  # Jest test suites
│   ├── jest.config.js
│   └── Dockerfile
├── scripts/
│   ├── setup.sh                # EC2 setup (idempotent)
│   └── deploy.sh               # Deployment (idempotent)
├── ec2.tf                      # Terraform EC2 config
├── variables.tf                # Terraform variables
├── render.yaml                 # Render deployment config
├── .prettierrc                 # Prettier config
└── README.md
```

---

## 🎯 Design Decisions

1. **Vite over CRA** – Faster dev server & builds, modern ESM-first approach
2. **MongoDB over SQLite** – Better suited for flexible product schemas with nested reviews
3. **Monorepo** – Single repo for client + server simplifies CI/CD and deployment
4. **Context API over Redux** – Sufficient for this app's complexity, less boilerplate
5. **Jest mocking (not mongodb-memory-server)** – Faster tests, no binary downloads in CI
6. **PM2 on EC2** – Process management with auto-restart, suitable for production

---

## ⚡ Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS between React (5173) and Express (5001) | Vite proxy in dev, CORS middleware in prod |
| Tests connecting to real MongoDB | Moved `connectDB()` from `app.js` to `index.js`, mock DB layer |
| Mongoose query chainability in tests | Custom thenable mocks that work with both `.select()` and direct `await` |
| Scripts running on fresh vs existing EC2 | Idempotent patterns: `mkdir -p`, `command -v`, `pm2 delete || true` |
| Consistent code style across team | Shared `.prettierrc` + ESLint + CI enforcement |

---

## 🏃 Quick Start

```bash
# Clone and install
git clone https://github.com/yashgoyal0110/devops-course-project.git
cd devops-course-project

# Start server
cd server
cp .env.example .env  # configure your MongoDB URI and JWT secret
npm install
npm run dev

# Start client (in a new terminal)
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`
