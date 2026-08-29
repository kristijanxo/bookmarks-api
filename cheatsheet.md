# NestJS + Docker + Prisma 8 Cheat Sheet

## Docker / PostgreSQL

```bash
# Start database
docker compose up -d

# Check containers
docker compose ps

# PostgreSQL logs
docker compose logs -f postgres

# Stop containers — database data stays
docker compose down

# ⚠️ Stop containers AND DELETE database data
docker compose down -v
```

---

# NestJS CLI

## Generate module

```bash
nest g module auth
```

Creates:

```text
auth/auth.module.ts
```

## Generate controller

```bash
nest g controller auth
```

Short form:

```bash
nest g co auth
```

## Generate service

```bash
nest g service auth
```

Short form:

```bash
nest g s auth
```

## Generate complete resource

```bash
nest g resource users
```

Can generate module, controller, service, DTOs, etc.

## Other useful generators

```bash
nest g guard auth
nest g decorator user
nest g pipe validation
nest g interceptor logging
nest g middleware logger
```

See all generators:

```bash
nest g --help
```

---

# Prisma 8

Main schema:

```text
src/prisma/contract.prisma
```

## Normal workflow

```text
Edit contract.prisma
        ↓
contract emit
        ↓
migration plan
        ↓
db migrate
```

### 1. Generate contract + TypeScript types

```bash
yarn prisma contract emit
```

Updates things such as:

```text
contract.json
contract.d.ts
```

Run this whenever you change `contract.prisma`.

---

### 2. Create migration

```bash
yarn prisma migration plan --name add-bookmarks
```

Examples:

```bash
yarn prisma migration plan --name init
yarn prisma migration plan --name add-user
yarn prisma migration plan --name add-description
```

This **creates the migration but does not apply it**.

---

### 3. Apply migration

```bash
yarn prisma db migrate --advance-ref db
```

This changes the actual PostgreSQL database.

`--advance-ref db` remembers that the database is now at this migration, so future migrations contain only newer changes.

---

# Typical Schema Change

Edit:

```text
src/prisma/contract.prisma
```

Then:

```bash
yarn prisma contract emit

yarn prisma migration plan --name add-user-field

yarn prisma db migrate --advance-ref db
```

This is the normal safe workflow.

It does **not** wipe the whole database.

---

# Check Database

## Verify contract matches database

```bash
yarn prisma db verify
```

## Migration status

```bash
yarn prisma migration status
```

## List migrations

```bash
yarn prisma migration list
```

---

# Inspect PostgreSQL Manually

Open PostgreSQL shell:

```bash
docker exec -it nest-postgres psql -U postgres -d nestdb
```

List tables:

```text
\dt
```

Inspect table:

```text
\d "User"
```

```text
\d "Bookmark"
```

Exit:

```text
\q
```

---

# Prisma Studio

Prisma 8 currently does not contain the `studio` command.

The standalone Studio is currently launched through Prisma 7.

Because Prisma 7 cannot parse the Prisma 8 `prisma.config.ts`, run it **outside the project directory**:

```bash
cd /tmp

yarn dlx prisma@7.10.0 studio --url="postgresql://postgres:postgres@localhost:5432/nestdb"
```

Then open:

```text
http://localhost:5555
```

For this local Docker database, putting:

```text
postgresql://postgres:postgres@localhost:5432/nestdb
```

directly in the command is fine.

For real/shared/production databases, don't put passwords directly in commands. Prefer an environment variable:

```bash
yarn dlx prisma@7.10.0 studio --url="$DATABASE_URL"
```

---

# Quick DB Update Without Migration

For temporary experimentation:

```bash
yarn prisma db update --dry-run
```

Then:

```bash
yarn prisma db update
```

This changes the database directly **without creating migration history**.

Prefer proper migrations for real project development.

---

# Completely Reset Local Database ⚠️

Deletes all PostgreSQL data:

```bash
docker compose down -v
docker compose up -d
```

Then recreate the DB from migrations:

```bash
yarn prisma db migrate --advance-ref db
```

Only use `down -v` when you intentionally want to delete your local database.

---

# Commands You'll Use Most

```bash
# Start DB
docker compose up -d

# Generate Nest files
nest g module auth
nest g controller auth
nest g service auth

# After editing contract.prisma
yarn prisma contract emit

# Create migration
yarn prisma migration plan --name my-change

# Apply migration
yarn prisma db migrate --advance-ref db

# Verify DB
yarn prisma db verify

# Stop DB but keep data
docker compose down

# ⚠️ Delete local DB completely
docker compose down -v
```
