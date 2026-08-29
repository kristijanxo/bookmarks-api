# NestJS + Docker + Prisma 8 Cheat Sheet

## Docker / PostgreSQL

```bash
# Start PostgreSQL in background
docker compose up -d

# Check containers
docker compose ps

# View PostgreSQL logs
docker compose logs -f postgres

# Stop containers — KEEP database data
docker compose down

# Stop containers AND DELETE database data ⚠️
docker compose down -v
```

After deleting the volume:

```bash
docker compose up -d
```

---

# Prisma 8 Basic Flow

Schema file:

```text
src/prisma/contract.prisma
```

Normal development flow:

```text
edit contract.prisma
        ↓
contract emit
        ↓
migration plan
        ↓
review migration
        ↓
db migrate
```

## 1. Generate contract/types

After changing `contract.prisma`:

```bash
yarn prisma contract emit
```

Generates/updates:

```text
contract.json
contract.d.ts
```

---

## 2. Create a migration

```bash
yarn prisma migration plan --name add-bookmarks
```

Examples:

```bash
yarn prisma migration plan --name init
yarn prisma migration plan --name add-user
yarn prisma migration plan --name add-bookmark-description
```

This creates migration files but **does not change the database yet**.

---

## 3. Apply pending migrations

```bash
yarn prisma db migrate --advance-ref db
```

This changes the database and moves the `db` reference forward.

Use this for normal development so the next migration contains only the **new changes**.

---

# Normal Schema Change

Example: add a field to `User`.

```prisma
model User {
  // ...
  username String?
}
```

Then:

```bash
yarn prisma contract emit
yarn prisma migration plan --name add-username
yarn prisma db migrate --advance-ref db
```

Existing data is **not automatically deleted**. Prisma applies the required schema change.

---

# Useful Checks

## Migration status

```bash
yarn prisma migration status
```

Shows applied and pending migrations.

## Check database matches contract

```bash
yarn prisma db verify
```

## See migrations

```bash
yarn prisma migration list
```

## Inspect a migration

```bash
yarn prisma migration show <migration-name>
```

---

# Quick Local Changes Without Migration Files

For experimentation:

```bash
yarn prisma contract emit
yarn prisma db update --dry-run
yarn prisma db update
```

`db update` changes the database directly without creating a migration.

Good for:

- experiments
- prototypes

Prefer proper migrations for:

- real project development
- Git
- team work
- production

---

# Completely Reset Local Database ⚠️

This deletes **all PostgreSQL data** in the Docker volume:

```bash
docker compose down -v
docker compose up -d
```

Then recreate the database from your migrations:

```bash
yarn prisma db migrate --advance-ref db
```

Use this only when you intentionally want a clean database.

---

# First-Time Database Bootstrap

Without migration history:

```bash
yarn prisma contract emit
yarn prisma db init
```

For a project where you want migration history, prefer:

```bash
yarn prisma contract emit
yarn prisma migration plan --name init
yarn prisma db migrate --advance-ref db
```

---

# Most Common Commands

```bash
# Start database
docker compose up -d

# After editing contract.prisma
yarn prisma contract emit

# Create migration
yarn prisma migration plan --name my-change

# Apply migration
yarn prisma db migrate --advance-ref db

# Check migrations
yarn prisma migration status

# Verify DB matches contract
yarn prisma db verify

# Stop DB, keep data
docker compose down

# DELETE local DB data ⚠️
docker compose down -v
```
