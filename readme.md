# 🗨️ Anonymous Forum

A simple anonymous forum where users can post and read messages using a unique pseudonym without any authentication.

## 🎯 Project Goals

- No user authentication
- Unique pseudonym per user
- Isolated Docker services
- Private API on internal network
- Automated CI/CD pipeline

## 🧱 Architecture

```
/api      → Backend service (create + read messages)
/db       → Database used by the API
/sender   → Message posting UI (port 8080)
/thread   → Message viewing UI (port 80)
```

## ⚙️ Technologies

- Docker & Docker Compose
- Git + Conventional Commits
- CI/CD GitHub Actions
- DB: PostgreSQL
- API & frontend services: NestJs + NextJs

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/BerdinClement/anonymous-forum.git
cd anonymous-forum

# Start the environment
docker-compose up --build
```

## 🧪 Testing & Validation

- Linting, formatting, unit tests
- Build Docker image with short commit hash tag

## 📦 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

