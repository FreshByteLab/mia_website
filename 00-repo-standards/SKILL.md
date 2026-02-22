---
name: repo-standards
description: Enforce repo conventions, PR-style changes, tests, and documentation updates.
---

# Use when
- Creating new files/folders
- Adding dependencies
- Refactoring
- Any non-trivial change

# Rules
- Keep changes small and reviewable.
- Add tests for behavior changes.
- Update docs/decisions for architectural decisions.
- Expand abbreviations on first use (e.g., Application Programming Interface (API)).
- Prefer deterministic code; use LLM calls only where needed.

# Output format
1) Plan (3-7 bullets)
2) Files to change
3) Implementation
4) Tests
5) Notes for reviewer
