# PakSwap Deployment Specification

> **Scope:** Local development setup (Docker Compose) + production architecture decisions.  
> **Stack reference:** See `11_TECH_STACK_DECISIONS.md` for all technology choices.

---

## 1. Local Development — Docker Compose

### Prerequisites
- Docker Desktop ≥ 24.x
- Node.js 20 LTS (for running migrations and seeding outside containers)
- AWS CLI (optional — only needed to test KMS/S3 locally via LocalStack)

### Services in `docker-compose.yml`

| Service | Image | Port | Notes |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432` | Primary database |
| `redis` | `redis:7-alpine` | `6379` | BullMQ queues + rate limiting |
| `api` | Local Dockerfile (Node.js 20) | `3000` | Fastify API server |
| `blockchain-monitor` | Local Dockerfile (Node.js 20) | — | Background worker only; no HTTP port |
| `paddle-ocr` | `paddlepaddle/paddle:latest-cpu` | `8866` | Fallback OCR microservice |
| `deepface` | Custom Dockerfile (Python 3.11) | `5000` | Liveness / face-match microservice |
| `localstack` | `localstack/localstack` | `4566` | Mocks AWS S3 + KMS locally |
| `mailhog` | `mailhog/mailhog` | `8025` (UI), `1025` (SMTP) | Catches outgoing emails in dev |

### Startup

```bash
# Copy env file
cp .env.example .env.local

# Start all services
docker compose up -d

# Run database migrations
npx prisma migrate dev

# Seed dev data (admin user, test KYC accounts, sample ads)
npm run db:seed

# View logs
docker compose logs -f api
```

### Health check URLs (local)

| Service | URL |
|---|---|
| API | http://localhost:3000/health |
| MailHog UI | http://localhost:8025 |
| LocalStack S3 | http://localhost:4566 |
| PaddleOCR | http://localhost:8866/predict/ocr_system |
| DeepFace | http://localhost:5000/verify |

### `.env.local` overrides for Docker
```
DATABASE_URL=postgresql://pakswap:pakswap@postgres:5432/pakswap_dev
REDIS_URL=redis://redis:6379
AWS_ENDPOINT_URL=http://localstack:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
SMTP_HOST=mailhog
SMTP_PORT=1025
```

---

## 2. Production Architecture

### Cloud Provider
**AWS** — preferred region: `ap-southeast-1` (Singapore; lowest latency to Pakistan).  
Backup region: `me-south-1` (Bahrain) for compliance if SBP/SECP requires data residency.

### Compute — ECS Fargate

| Service | vCPU | Memory | Min Tasks | Max Tasks | Scaling Trigger |
|---|---|---|---|---|---|
| `api` | 1 | 2 GB | 2 | 10 | CPU > 60% |
| `blockchain-monitor` | 0.5 | 1 GB | 1 | 2 | Always-on; no scale-in |
| `ocr-worker` | 1 | 2 GB | 1 | 4 | BullMQ queue depth > 20 |
| `payout-worker` | 0.5 | 1 GB | 1 | 1 | Single instance — prevents double-release |
| `deepface` | 1 | 2 GB | 1 | 2 | CPU > 70% |

> **Payout worker must always be a single instance.** Horizontal scaling of the payout worker is explicitly forbidden — double-payout risk. Redis SETNX lock provides additional safety.

### Database — AWS RDS PostgreSQL 16
- Instance: `db.t4g.medium` (MVP), scale to `db.r7g.large` at 10K+ users
- Multi-AZ enabled from day one
- Automated backups: 7-day retention
- Read replica: add when read:write ratio exceeds 3:1

### Cache / Queues — AWS ElastiCache Redis 7
- Cluster mode: disabled (MVP); enable when throughput > 50K ops/sec
- Node: `cache.t4g.medium`
- Persistence: AOF enabled (protects BullMQ queue jobs on restart)

### File Storage — AWS S3
- Bucket: `pakswap-uploads-prod` (private)
- KYC documents: prefix `kyc/`; server-side encryption (SSE-KMS)
- Payment screenshots: prefix `payment-proofs/`; SSE-KMS
- Presigned URL TTL: 15 minutes for upload, 5 minutes for admin view

### Secrets — AWS Secrets Manager
All credentials (DB password, JWT secret, Twilio key, SendGrid key, etc.) stored in Secrets Manager. ECS task role has read-only access via IAM. Never pass secrets as environment variables in task definition — inject at runtime via Secrets Manager ARN reference.

### Signing Service — Isolated ECS Task
- Runs in a separate VPC subnet with no public internet access
- Communicates only with payout-worker via internal ALB
- mTLS enforced (mutual certificate auth) — see `11_TECH_STACK_DECISIONS.md §8`
- AWS KMS key: `pakswap-wallet-signing` (key rotation: annual)

### CDN & DNS — Cloudflare
- All API traffic: `api.pakswap.com` → Cloudflare → ALB
- DDoS protection: Cloudflare Pro minimum
- Rate limiting: Cloudflare layer (IP-level) + Fastify layer (user-level) — two layers
- SSL: Cloudflare Full Strict mode; origin certificate on ALB

### CI/CD — GitHub Actions

```
Push to main branch
  → Run tests (unit + integration)
  → Build Docker image
  → Push to ECR
  → Deploy to ECS Fargate (rolling update, 0 downtime)
  → Run smoke tests against staging
  → Notify Slack (#deploys)
```

**Environments:**

| Environment | Branch | URL | Auto-deploy |
|---|---|---|---|
| `local` | any | localhost | Manual |
| `staging` | `develop` | staging.pakswap.com | Yes — on push |
| `production` | `main` | pakswap.com | Yes — after staging passes |

### Monitoring Stack

| Tool | Purpose |
|---|---|
| **Sentry** | Error tracking (all services) |
| **Pino + CloudWatch Logs** | Structured JSON logs |
| **Prometheus + Grafana** | Metrics (queue depth, latency, trade volume) |
| **CloudWatch Alarms** | Alerts: CPU > 80%, error rate > 1%, payout queue depth > 50 |
| **Slack #alerts** | All CloudWatch alarms routed here |

### Estimated Monthly Cost (MVP, ~1,000 MAU)

| Service | Estimated Cost |
|---|---|
| ECS Fargate (all tasks) | ~$80 |
| RDS PostgreSQL (t4g.medium, Multi-AZ) | ~$90 |
| ElastiCache Redis (t4g.medium) | ~$35 |
| S3 + data transfer | ~$10 |
| Cloudflare Pro | $20 |
| Secrets Manager | ~$5 |
| Misc (CloudWatch, ECR, etc.) | ~$15 |
| **Total** | **~$255/month** |

Scale estimate: ~$600/month at 10K MAU.

---

## 3. Pre-Launch Checklist

- [ ] All secrets migrated from `.env` to AWS Secrets Manager
- [ ] RDS Multi-AZ confirmed enabled
- [ ] S3 bucket ACL: Block all public access = ON
- [ ] Cloudflare SSL mode = Full Strict
- [ ] Payout worker: single ECS task confirmed; auto-scaling disabled
- [ ] Signing service VPC: no public subnet route
- [ ] KMS key rotation: enabled
- [ ] GitHub Actions secrets: AWS role ARN via OIDC (not static keys)
- [ ] Staging smoke test suite passes for: login, KYC upload, P2P trade, Instant Buy order
- [ ] CloudWatch alarms set and routed to Slack
- [ ] Rollback plan: ECS service re-deploy to previous task definition version

---

*Cross-references: `11_TECH_STACK_DECISIONS.md` (all tool choices), `04_SYSTEM_ARCHITECTURE_AND_DATABASE.md` (DB schema), `13_RATE_LIMITS_AND_ERROR_STATES.md` (rate limit config values for Cloudflare + Fastify layers).*
