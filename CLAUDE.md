# Project: mia_website

## Goal
One paragraph describing what this repo does and who it is for.

## Stack
- Primary language(s): TODO
- Frameworks: TODO
- Storage: TODO
- Runtime/Deployment: TODO

## Non-goals (boundaries)
- TODO: list 3-6 explicit non-goals

## Commands (source of truth)
- Install: npm install
- Dev: npm run dev
- Test: npm test
- Lint: npm run lint
- Build: npm run build
- Run: npm start

## Artificial Intelligence (AI) skills
This repo vendors shared AI skills from FreshByteLab/ai_skills into `.claude/skills` using Git subtree.

Codex and Claude Code should both load the same skills:
- `.claude/skills` (source)
- `.codex/skills` (link or copy)

Update skills:
```bash
git subtree pull --prefix=.claude/skills ai_skills main --squash
```

## Conventions
- TypeScript-first where applicable
- Explicit types on public functions
- All abbreviations expanded on first use (example: Structured Query Language (SQL))
- Prefer small modules; avoid one-file "god services"
- Keep changes small and reviewable

## Definition of Done
- Feature works end-to-end
- Has tests (if the repo has a test framework)
- Docs updated where relevant (docs/decisions or docs/product)
- Migrations included if schema changed

<!-- TODO: Add GET /health endpoint (Fastify detected). Return JSON { "status": "ok" }. -->
