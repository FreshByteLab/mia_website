---
name: architecture-and-boundaries
description: Define modules, boundaries, interfaces, and prevent scope creep.
---

# Use when
- Starting a new feature or subsystem
- Adding an integration (Telegram, email, notes)
- Introducing background jobs/schedulers

# Architecture pattern
- /src/api routes only do request/response mapping
- /src/services contains business logic
- /src/db handles persistence and migrations
- /src/integrations contains external APIs
- /src/jobs contains scheduled tasks

# Decision checklist
- What is the input? What is the output?
- Where does persistence happen?
- What errors are expected and how are they surfaced?
- What should be synchronous vs asynchronous?

# Deliverable
A short architecture note + folder/file plan before writing code.
