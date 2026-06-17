# Contributing to SQLab

Thanks for considering a contribution to SQLab. The project is a local SQL practice platform, so the best contributions are improvements that make SQL learning clearer, safer, and easier to maintain.

## Good First Contributions

- Improve README clarity or setup instructions
- Add tests around SQL validation behavior
- Improve accessibility, keyboard navigation, and focus states
- Polish learner-facing feedback messages
- Add small UI improvements that keep the workspace focused
- Propose new SQL exercises with hints and validation queries

## Development Setup

```bash
docker compose up -d db
bun install
bun run db:seed
bun run dev
```

The web app runs at http://localhost:3000 and the API server runs at http://localhost:3001.

## Before Opening a Pull Request

Run the verification commands:

```bash
bun run typecheck
bun run build
bun run test
```

For database or exercise changes, also run:

```bash
bun run db:seed
```

## Exercise Contributions

Exercise changes should include:

- A clear prompt
- Progressive hints
- One or more accepted solution queries
- Validation logic or verification queries
- Tests when the validation behavior changes

Please keep exercise content original or clearly attributed. Do not submit copyrighted classroom material without permission.

## AI-Assisted Contributions

AI tools are welcome as part of the development workflow, but generated code, hints, tests, and documentation should be reviewed by a human contributor before submission.

When using AI assistance, please check:

- The code follows the existing project architecture
- SQL solutions are correct against the seeded database
- Hints do not reveal the complete answer too early
- Tests cover any changed validation behavior
- Documentation stays accurate and beginner-friendly
