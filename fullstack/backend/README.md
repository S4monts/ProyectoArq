# Medicor Backend — Migration & Test Guide

This repository contains the Medicor backend (Express + SQLite). Below are commands and notes to migrate data from legacy JSON files to the normalized SQLite schema, run tests, and prepare a PR.

Prerequisites
- Node.js >= 14
- npm

Quick start (development)

1. Install dependencies

```powershell
cd .\fullstack\backend
npm install
```

2. Start local server

```powershell
npm run dev
# or
npm start
```

Database migration

There are two migration helper scripts in `src/migrations`:

- `normalize-1-create-normalized-tables.js` — creates normalized tables (`*_norm`).
- `normalize-2-migrate-data.js` — copies data from the legacy `json` column tables into the normalized tables.

Run both in order:

```powershell
cd .\fullstack\backend
npm run migrate:create
npm run migrate:run
```

The scripts use the database file at `src/data/medicor.db`. The import script will also create a backup of original JSON files in `src/data_backup/` when the previous import utility was used.

Testing

Unit / integration tests use Mocha + Supertest + Chai (already added to `devDependencies`). Run:

```powershell
cd .\fullstack\backend
npm test
```

Notes about tests:
- Tests assume the Express app is exported from `src/index.js` so they can require it without starting a server.
- Some tests create unique DNIs to avoid duplicate collisions across runs.

Prepare a commit & PR

Suggested git workflow (from repository root):

```powershell
cd .\fullstack\backend
# check changes
git status
git add -A
git commit -m "feat(migration): add normalized tables + tests; prefer *_norm in repos"
# create branch and push
git checkout -b feature/sqlite-normalized-migration
git push -u origin feature/sqlite-normalized-migration
```

Then open a Pull Request in GitHub from `feature/sqlite-normalized-migration` into your main branch. In the PR description, include:
- Summary of changes (repos preferring `*_norm`, new migration scripts, tests added).
- How to run migrations and tests (copy the relevant sections from this README).
- Any manual checks you recommend (e.g., spot-check rows in `src/data/medicor.db`).

CI suggestion

Add a simple GitHub Actions workflow (`.github/workflows/nodejs.yml`) that:
- Installs Node.js
- Runs `npm ci`
- Runs `npm run migrate:create` and `npm run migrate:run` (optional in CI)
- Runs `npm test`

That's it — if you want, I can create the PR branch locally and run the `git` commands for you (I will create the commit and provide the exact commands; pushing requires your credentials from your machine). Alternatively I can prepare the patch for you to review/commit.
