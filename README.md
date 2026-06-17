# SQLab

SQLab is an open-source SQL practice platform for students learning relational databases. It provides a local, interactive workspace where learners can write SQL, inspect a realistic schema, run queries, and submit answers for automatic validation.

The current exercise set uses **DZTelecom**, a fictional Algerian telecom database with customers, subscriber lines, plans, services, usage events, recharges, and signups. SQLab was originally built to support database revision for the BDD module at the Higher National School of Computer Science (ESI), Algiers, and is now maintained as a reusable learning tool for SQL practice.

## Why SQLab?

Many SQL learners get stuck between static PDF exercises and full database tooling that gives little learning feedback. SQLab sits in the middle: it feels like a focused workbook, but it validates real SQL against a real MySQL database.

The project is useful for:

- Students practicing relational database concepts before exams
- Teachers who want a local SQL lab for classroom exercises
- Contributors interested in SQL education, feedback systems, and query validation
- Maintainers experimenting with AI-assisted review, test generation, and educational tooling

## Features

- **25 SQL exercises** across DDL and DQL topics
- **Real MySQL execution** through a local Docker database
- **Syntax-highlighted SQL editor** powered by CodeMirror 6
- **Run and Submit workflow** for experimentation and final validation
- **Result-based validation** that compares output instead of matching SQL text
- **Detailed feedback** for column mismatches, row count differences, data differences, and MySQL errors
- **Progressive hints** and locked solutions for self-paced revision
- **Interactive schema viewer** with ER diagram, table metadata, and data previews
- **Sandbox mode** for free-form querying against the DZTelecom database
- **Local progress tracking** with completion state stored in the browser
- **Keyboard shortcuts** for fast query execution and submission
- **Dark, code-first interface** designed for focused study sessions

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo with Bun workspaces |
| Frontend | React 19, TanStack Router, tRPC client, TanStack Query, Tailwind CSS v4 |
| Editor | CodeMirror 6 via `@uiw/react-codemirror` |
| Backend | Standalone tRPC server on Node HTTP |
| Database | MySQL 8 via Docker, Drizzle ORM, mysql2 |
| Tooling | TypeScript, Biome, Vitest |

## Getting Started

### Requirements

- [Bun](https://bun.sh) 1.2 or newer
- [Docker](https://www.docker.com/) for MySQL
- Node.js 20 or newer, if your environment does not already provide it

### 1. Start the database

```bash
docker compose up -d db
```

This starts MySQL on `localhost:3308` with database `DZTelecom`, user `root`, and password `root`.

### 2. Install dependencies

```bash
bun install
```

### 3. Seed the database

```bash
bun run db:seed
```

Database reseeding is a developer/admin maintenance action. Normal app users cannot trigger it from the learner-facing API.

### 4. Start the app

```bash
bun run dev
```

- Web app: http://localhost:3000
- API server: http://localhost:3001

## Available Commands

| Command | Description |
|---|---|
| `bun run dev` | Start the web app and API server through Turborepo |
| `bun run build` | Type-check and build all packages |
| `bun run typecheck` | Run TypeScript checks across the workspace |
| `bun run lint` | Run Biome checks |
| `bun run format` | Format files with Biome |
| `bun run test` | Run test suites through Turborepo |
| `bun run db:seed` | Drop and re-seed the local DZTelecom database |

## Project Structure

```text
SQLab/
├── apps/
│   └── web/                  # React frontend
│       └── src/
│           ├── components/   # UI and learning workspace components
│           ├── hooks/        # progress and guided tour state
│           ├── lib/          # tRPC client, validation types, platform helpers
│           └── routes/       # TanStack Router route definitions
├── packages/
│   ├── api/                  # tRPC server and SQL validation logic
│   │   └── src/
│   │       ├── router.ts     # API procedures
│   │       └── exercises.ts  # exercise definitions, hints, solutions
│   └── db/                   # database package
│       └── src/
│           ├── index.ts      # Drizzle instance and mysql2 pool
│           ├── schema.ts     # Drizzle table definitions
│           └── seed.ts       # database seeder
├── docker-compose.yaml       # local MySQL service
├── TelecomDZ_schema_data.sql # raw schema and seed data
├── turbo.json
└── package.json
```

## Exercise Set

The current DZTelecom track contains 25 exercises:

| Section | Count | Topic |
|---|---:|---|
| Exercise 1 | 8 | DDL table creation |
| Exercise 2, Part 1 | 5 | Basic DQL: `SELECT`, joins, filtering |
| Exercise 2, Part 2 | 4 | Aggregation: `GROUP BY`, `HAVING`, calculations |
| Exercise 2, Part 3 | 5 | Advanced queries: division, subqueries, CTEs |
| Exercise 2, Part 4 | 3 | DDL changes: `ALTER`, views, constraints |

Each exercise includes progressive hints and one or more accepted solution queries. Validation compares query output, so learners can solve exercises with different valid SQL approaches.

## Database Schema

**DZTelecom** is a fictional Algerian mobile operator with 8 tables:

- `CUSTOMER`: people who own mobile lines
- `SUBSCRIBER`: mobile lines identified by phone number
- `RECHARGE`: prepaid credit top-up events
- `SERVICE`: available telecom services
- `USES`: usage events such as calls, SMS, and data consumption
- `PLAN`: mobile plans with monthly rates
- `FEATURE`: features included in each plan
- `SIGNUP`: subscriber plan signups

Main relationships: `CUSTOMER` to `SUBSCRIBER`, `SUBSCRIBER` to `RECHARGE`/`USES`/`SIGNUP`, `SERVICE` to `USES`, and `PLAN` to `FEATURE`/`SIGNUP`.

## Roadmap

- Add more exercise packs beyond DZTelecom
- Add import/export support for custom SQL tracks
- Improve accessibility and keyboard-only workflows
- Add real screenshots and a short demo GIF to the README
- Add optional hosted demo deployment
- Expand validation diagnostics for common SQL mistakes
- Add maintainer automation for issue triage, tests, and pull request review

## AI-Assisted Maintenance

SQLab is a good candidate for responsible AI-assisted open-source maintenance. Areas where AI tools can help include:

- Reviewing pull requests for regressions in SQL validation logic
- Generating focused tests for new exercise packs
- Improving hints while keeping final answers hidden
- Checking documentation clarity for beginner learners
- Auditing SQL execution boundaries and learner-facing error messages
- Drafting release notes and contributor onboarding updates

Any AI-assisted changes should still be reviewed by a human maintainer before merge.

## Contributing

Contributions are welcome. Good first contributions include documentation improvements, UI polish, accessibility fixes, test coverage, and new SQL exercises with validation queries.

Before opening a pull request:

```bash
bun run typecheck
bun run build
bun run test
```

For exercise changes, also run:

```bash
bun run db:seed
```

Please keep exercise content original or clearly attributed, and avoid submitting copyrighted classroom material without permission. See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## Security

SQLab is designed as a local learning app, but it still executes user-provided SQL against a local database. Please report security issues privately instead of opening a public issue when possible. See [SECURITY.md](./SECURITY.md) for the reporting policy.

Areas of particular interest:

- SQL execution boundaries
- DDL validation isolation
- API access controls
- Docker and local database configuration
- Error messages that may expose unnecessary internal details

## Acknowledgements

SQLab began as a study tool for the Databases (BDD) module at ESI Algiers. Thanks to the teachers and classmates whose coursework context motivated the project.

The DZTelecom dataset is fictional and maintained for educational use in this repository.

## License

SQLab is released under the [MIT License](./LICENSE).
