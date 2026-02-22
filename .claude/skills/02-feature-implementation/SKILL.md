---
name: feature-implementation
description: Implement an end-to-end feature with API, services, DB updates, tests, and docs.
---

# Use when
- Adding a new endpoint
- Adding a new user-visible behavior
- Adding a new processing pipeline

# Workflow
1) Define contract: request/response schema
2) Implement service logic (pure functions where possible)
3) Persist in DB if needed
4) Add tests (unit + integration where appropriate)
5) Add docs snippet describing usage

# Guardrails
- No hidden state
- No magic defaults without documenting them
- Prefer idempotent operations
