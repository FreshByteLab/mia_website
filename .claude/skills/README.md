# ai_skills

Shared Artificial Intelligence (AI) skills for Claude Code and Codex, distributed via Git subtree.

## Structure

```
ai_skills/
  00-repo-standards/SKILL.md        — Repository conventions and Pull Request (PR) standards
  01-architecture-and-boundaries/SKILL.md — Module design and boundary enforcement
  02-feature-implementation/SKILL.md — End-to-end feature workflow
  03-data-and-schema/SKILL.md       — Structured Query Language (SQL) schema, migrations, indexes
  04-deploy-and-ops/SKILL.md        — Docker, environment variables, health checks, backups
```

## How skills are vendored into projects

Each project vendors this repository under `.claude/skills` using Git subtree:

```bash
# Initial add (run once per project)
git remote add ai_skills https://github.com/FreshByteLab/ai_skills.git
git subtree add --prefix=.claude/skills ai_skills main --squash
```

## Updating skills in a project

Tag releases here in `ai_skills` (e.g., `v0.1.0`, `v0.2.0`), then in each project run:

```bash
git subtree pull --prefix=.claude/skills ai_skills main --squash
```

## Codex + Claude Code unification

Both tools load the same skills:

- **Claude Code** reads from `.claude/skills`
- **Codex** reads from `.codex/skills`

`.codex/skills` is a symlink (macOS/Linux) or directory junction (Windows) pointing to `.claude/skills`.
If linking is not possible, `.codex/skills` is a copy — see the project's `CLAUDE.md` for details.

## Releases

| Tag    | Date       | Notes              |
|--------|------------|--------------------|
| v0.1.0 | 2026-02-22 | Initial skill set  |
