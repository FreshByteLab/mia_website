---
name: data-and-schema
description: Design SQLite schema, write migrations, indexes, and safe query patterns.
---

# Use when
- Adding/changing tables
- Performance issues
- Data lifecycle questions (retention, audit trail)

# Rules
- Every schema change needs a migration file.
- Use foreign keys (and enforce them).
- Add indexes for query paths you actually use.
- Keep payloads normalized; store raw text separately if needed.

# Deliverables
- SQL migration(s)
- Updated data access functions
- Tests validating the schema behavior
