# DDL Creation Verification Audit

## Scope

This audit covers the table-creation exercises in Exercise 1 (`1.1` through `1.9`) and how their current DDL verification behaves when a student submits malformed `CREATE TABLE` SQL.

The current validation path is:

- `packages/api/src/router.ts` runs DDL submissions inside a disposable schema.
- Exercise 1 dependencies are created from previous solution SQL where needed.
- The student SQL is executed.
- Each exercise's `verificationQueries` from `packages/api/src/exercises.ts` is compared with expected result sets.

That execution architecture is solid: it isolates student DDL from the canonical database and lets the app validate real database behavior. The weak point is the verification data for table-creation exercises.

## Current Verification Model

The shared `tableVerifications()` helper currently checks only:

- table exists
- total column count
- primary-key column count
- foreign-key column count

This is defined around `packages/api/src/exercises.ts:167` to `packages/api/src/exercises.ts:232`, and all single-table creation exercises use it at `packages/api/src/exercises.ts:251`, `268`, `285`, `302`, `319`, `336`, `352`, and `369`.

Exercise `1.9` checks that all eight expected tables exist, but then only applies detailed count checks to `SIGNUP` and `USES` at `packages/api/src/exercises.ts:386` to `packages/api/src/exercises.ts:400`. That means the full creation script can have weak or incorrect definitions for `CUSTOMER`, `SUBSCRIBER`, `RECHARGE`, `SERVICE`, `PLAN`, and `FEATURE` while still passing.

## Mutation Test Results

I ran these mutations directly against `validateDdlExercise()` using the current code and a live disposable schema. Results below show whether the current verifier accepted or rejected each malformed submission.

| Exercise | Mutation | Current result |
|---|---|---|
| `1.1` | `CLIENT` table instead of `CUSTOMER` | Rejected |
| `1.1` | `CUSTOMER(test, test2, test3, test4)` with only a primary key | Accepted |
| `1.1` | Correct column names but wrong data types | Accepted |
| `1.1` | Missing unique constraint on `email` | Accepted |
| `1.1` | Correct columns in a different order | Accepted |
| `1.2` | Wrong column names and types with one valid foreign-key count | Accepted |
| `1.2` | Missing `ON UPDATE CASCADE` and `ON DELETE CASCADE` | Accepted |
| `1.3` | Missing positive amount `CHECK` constraint | Accepted |
| `1.4` | Wrong `SERVICE` column names and types | Accepted |
| `1.5` | Wrong `USES` columns and types with same primary/foreign-key counts | Accepted |
| `1.5` | Missing defaults on `callDuration`, `dataBytes`, and `amount` | Accepted |
| `1.6` | Missing non-negative `monthlyRate` check | Accepted |
| `1.7` | Foreign key attached to the wrong local column name | Accepted |
| `1.8` | Missing `startDate < endDate` check | Accepted |
| `1.8` | Wrong `SIGNUP` columns with same primary/foreign-key counts | Accepted |
| `1.9` | All expected table names exist, but most table schemas are weak or wrong | Accepted |

The only mutation rejected in this suite was the wrong table name, because `tableExistsVerification()` catches table identity. Everything else passes if counts line up.

## Gaps To Close

The verifier should validate schema shape, not just object counts.

It should reject:

- wrong table name
- missing expected table
- extra table in the full creation script, if strictness is desired
- missing expected column
- extra column, unless the exercise intentionally allows it
- wrong column order, only if the course requires order; otherwise ignore order
- wrong data type family
- wrong varchar length
- wrong decimal precision and scale
- wrong date/datetime type
- wrong nullability
- missing default values
- wrong default values
- missing `AUTO_INCREMENT`
- wrong primary-key columns
- wrong primary-key column order for composite keys
- missing unique constraints
- wrong unique constraint columns
- missing foreign keys
- foreign keys on the wrong local columns
- foreign keys referencing the wrong table or column
- missing `ON UPDATE` and `ON DELETE` actions
- missing check constraints where MySQL exposes them in `INFORMATION_SCHEMA.CHECK_CONSTRAINTS`
- check constraints that do not enforce the intended behavior

## Recommended Architecture

The cleanest path is to introduce a typed schema-expectation layer in `packages/api`, then generate verification queries from that metadata.

Do not keep expanding ad hoc SQL arrays inside each exercise. That would make `exercises.ts` noisy and easy to drift. The project already has canonical table definitions as solution SQL near `packages/api/src/exercises.ts:57` to `packages/api/src/exercises.ts:153`; the expected verification metadata should live near that source of truth, but in a structured form.

Recommended shape:

```ts
type ExpectedColumn = {
  name: string;
  ordinal: number;
  dataType: string;
  columnType?: string;
  nullable: boolean;
  default?: string | null;
  autoIncrement?: boolean;
};

type ExpectedForeignKey = {
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
  onUpdate?: "CASCADE" | "RESTRICT" | "NO ACTION" | "SET NULL";
  onDelete?: "CASCADE" | "RESTRICT" | "NO ACTION" | "SET NULL";
};

type ExpectedTableSchema = {
  tableName: string;
  columns: ExpectedColumn[];
  primaryKey: string[];
  uniqueKeys?: string[][];
  foreignKeys?: ExpectedForeignKey[];
  checks?: Array<{ expressionIncludes: string[] }>;
};
```

Then add a helper such as `tableSchemaVerifications(expectedTable)` that emits the existing `VerificationQuery[]` format. This preserves the current validator loop in `validateDdlExercise()` and keeps changes low-risk.

## Query Strategy

Use `INFORMATION_SCHEMA` for structural metadata:

- `INFORMATION_SCHEMA.COLUMNS` for names, order, data types, `COLUMN_TYPE`, nullability, defaults, and `EXTRA` for `auto_increment`.
- `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` plus `TABLE_CONSTRAINTS` for primary keys, unique keys, and foreign-key column mappings.
- `INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS` for `UPDATE_RULE` and `DELETE_RULE`.
- `INFORMATION_SCHEMA.CHECK_CONSTRAINTS` joined through `TABLE_CONSTRAINTS` for named check constraints.

For check constraints, metadata text can vary slightly across MySQL versions. For high-confidence validation, combine metadata checks with behavioral probes when possible:

- For `RECHARGE.amount > 0`, try inserting an invalid recharge amount and expect failure.
- For `PLAN.monthlyRate >= 0`, try inserting a negative monthly rate and expect failure.
- For `SIGNUP.startDate < endDate`, try inserting an invalid date range and expect failure.

The current `VerificationQuery` type only supports queries that return expected rows. Behavioral probes need either:

- a new `VerificationStep` union with `query` and `expectError` variants, or
- a helper query that reports whether the constraint exists and has the intended expression.

The cleaner long-term option is the `VerificationStep` union, because DDL correctness sometimes means an invalid write must fail.

## Full Script Exercise

Exercise `1.9` should reuse the same expected schemas for all eight tables, not maintain a separate weaker verifier.

Recommended implementation:

- Keep the `tableCount` check.
- Add a strict expected-table-name set check, so no extra tables pass silently if that matters pedagogically.
- Spread `tableSchemaVerifications()` for `CUSTOMER`, `SUBSCRIBER`, `RECHARGE`, `SERVICE`, `USES`, `PLAN`, `FEATURE`, and `SIGNUP`.

This makes `1.9` automatically stay aligned with exercises `1.1` through `1.8`.

## Tests To Add

Add focused regression tests in `packages/api/src/__tests__/router.test.ts` or a dedicated `ddl-creation-verification.test.ts`.

Minimum regression matrix:

- valid solution passes for every creation exercise `1.1` through `1.9`
- wrong table name fails
- wrong column name fails
- wrong data type fails
- missing required nullability fails
- missing default fails where expected
- missing `AUTO_INCREMENT` fails where expected
- missing unique constraint fails for `CUSTOMER.email`
- missing check constraint fails for `RECHARGE.amount`, `PLAN.monthlyRate`, and `SIGNUP` dates
- missing cascade actions fail for every expected foreign key
- wrong primary-key column order fails for composite keys if order is required
- reordered non-key columns pass or fail according to an explicit course decision
- `1.9` fails when any one of the eight table schemas is weak

## Recommended Implementation Order

1. Add expected schema metadata for the eight Exercise 1 tables.
2. Implement `tableSchemaVerifications()` using `INFORMATION_SCHEMA`.
3. Replace `tableVerifications()` usage for `1.1` through `1.8`.
4. Make `1.9` compose all eight expected table verifications.
5. Add mutation regression tests before changing expected behavior.
6. Add behavioral verification support for checks if metadata-only check parsing is not reliable enough.

This keeps the existing disposable-schema validator, worker queue, and result comparison model intact while making the correctness contract precise.
