---
name: ubiquitous-language
description: Build and maintain a canonical domain glossary in UBIQUITOUS_LANGUAGE.md from the current conversation and existing repo terminology. Use when the user wants to define terms, harden language, create a shared glossary, establish a domain model, or mentions DDD or ubiquitous language.
---

# Ubiquitous Language

Create and maintain a canonical glossary for the project so future agents can use the same domain terms consistently.

## Process

### 1. Reuse the discussion already present in the current thread

Extract the important domain concepts, roles, lifecycle states, and relationships that have already been discussed.

If the language is already clear, do not re-interview the user unnecessarily. Only ask follow-up questions for unresolved, ambiguous, or conflicting terms.

### 2. Check existing terminology before inventing new language

If `UBIQUITOUS_LANGUAGE.md` already exists, read it first and preserve the established terms unless the conversation clearly changes them.

When relevant, explore the repo to verify terminology that is already embedded in the product, docs, or codebase. Prefer existing domain language over freshly invented names unless the existing language is ambiguous or inconsistent.

### 3. Normalize the language

Identify:

- terms used for multiple concepts
- multiple terms used for the same concept
- vague, overloaded, or misleading names
- missing terms that need an explicit definition

Pick a canonical term for each concept. Be opinionated, but ground the choice in the conversation and repo context.

### 4. Write the glossary

Write or update `UBIQUITOUS_LANGUAGE.md` in the working directory.

The file should be a clean canonical reference for future agents. Optimize for clarity and scanability, not prose.

Use this structure:

```md
# Ubiquitous Language

## <Domain area>

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Order** | A customer's request to purchase one or more items. | Purchase, transaction |
| **Invoice** | A request for payment for fulfilled items. | Bill, payment request |

## Relationships

- An **Order** may produce multiple **Invoices**.
- An **Invoice** belongs to exactly one **Customer**.

## Flagged ambiguities

- **Account** has been used to mean both **Customer** and **User**. Use **Customer** for the commercial entity and **User** for the authentication identity.
```

Group terms into multiple sections when natural clusters emerge, such as actors, lifecycle concepts, billing, fulfillment, or permissions. If the domain is small and cohesive, one section is enough.

### 5. Summarize the result inline

After writing the file, summarize:

- the canonical terms that matter most
- the main ambiguities or conflicts that were resolved
- any important open terminology questions that still need user input

## Rules

- Only include domain language. Skip generic implementation terms unless they carry domain meaning.
- Keep definitions tight. One sentence is usually enough.
- Define what a term is before describing behavior around it.
- Show important relationships explicitly, including cardinality when it matters.
- List rejected synonyms in `Aliases to avoid` when that helps future agents stay consistent.
- Prefer a clean current-state glossary. Do not annotate entries with `(new)` or `(updated)`.
- If understanding changes later, rewrite the glossary to reflect the latest agreed language rather than preserving document history inside the file.

## Re-running

When invoked again later:

1. Read the existing `UBIQUITOUS_LANGUAGE.md`.
2. Incorporate any newly clarified terms from the conversation.
3. Remove or rewrite entries that no longer reflect the latest understanding.
4. Revisit the `Flagged ambiguities` section and keep only active ambiguities.
5. Preserve stable canonical terms unless there is a strong reason to rename them.

After updating the file, state that `UBIQUITOUS_LANGUAGE.md` has been written or updated and that you will use those terms consistently going forward.