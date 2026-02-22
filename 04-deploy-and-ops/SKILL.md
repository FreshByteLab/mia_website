---
name: deploy-and-ops
description: Dockerize, configure environments, and create migration-friendly deployment for Synology and Hetzner.
---

# Use when
- Creating Dockerfile / compose
- Adding env vars / secrets
- Making background jobs
- Setting up backups

# Rules
- All config via environment variables (no hardcoding).
- Provide a .env.example file.
- Provide health checks.
- SQLite file location must be configurable and persistent.

# Deliverables
- Dockerfile + compose.yaml
- Health endpoint (/health)
- Backup strategy note (docs/decisions/backups.md)
