---
name: design-system
description: Create, extend, or refactor frontend UI so the whole product follows one shared design system. Use when creating any frontend page, layout, component, dashboard, form, settings area, table, or visualization, and when you need consistent tokens, typography, color usage, spacing, surface styling, states, and interaction rules across the entire interface.
---

Use this skill as the global UI system for the whole frontend, not for one specific page.

It is inspired by a dense operational dashboard style, but the important part is the reusable system:

- shared tokens
- shared typography
- shared surface language
- shared status colors
- shared interaction rules
- shared density and spacing rules

Do not reproduce any specific reference content, routes, labels, or domain-specific modules unless the user explicitly asks for that.

## Background Policy (Critical)

- The app/page shell background must be a solid color, not a gradient.
- Light mode shell background: `#FFFCF7`.
- Dark mode shell background: `#272421`.
- Do not use brand/status colors (`#02A9A2`, `#C1333F`, `#FFCA00`, `#EC9E00`) as page-wide backgrounds.
- Use brand/status colors semantically for actions, states, badges, alerts, charts, and highlights.
- Decorative gradients are only allowed if the user explicitly requests a gradient treatment for a specific element.

## Quick Start

1. Read `references/design-system.md` for the canonical tokens and visual language.
2. Read `references/implementation-guide.md` before building or refactoring UI.
3. Read `references/component-rules.md` when shaping layouts, cards, tables, forms, filters, charts, and navigation.
4. Apply the system to every touched surface so the frontend stays visually coherent.

## Core Rule

Whenever you build frontend UI, prefer consistency with this system over inventing a new visual language for a single page.

If a page needs to feel special, make it special inside the same system by changing composition, data emphasis, or module priority, not by changing tokens or base styling.

## Workflow

### 1. Start from tokens

Before writing UI, anchor the work to the system tokens:

- brand colors
- theme colors
- typography
- surface treatment
- spacing and density
- semantic state colors

### 2. Build the shell first

Keep the high-level app frame coherent across the product:

- navigation
- top bars and utility zones
- headings
- content containers
- panels and cards

### 3. Reuse the same component language

Across the whole frontend, use the same rules for:

- cards
- tables
- forms
- tabs
- badges
- filters
- charts
- empty states
- status indicators

### 4. Keep the tone operational and clear

- headings should be short
- labels should be explicit
- supporting copy should be concise
- states should be visible, not implied
- metadata should be shown when it helps interpretation

### 5. Prevent one-off styling drift

Do not introduce page-only color systems, spacing scales, border radii, or typography stacks unless the user explicitly wants a new system.

## Reference Files

- `references/design-system.md` for the canonical tokens and design foundations.
- `references/implementation-guide.md` for system-wide application rules.
- `references/component-rules.md` for reusable component and layout guidance.

## When To Revisit The System

Update this system when:

- the brand palette changes
- theme anchors change
- the product adopts a new typography system
- the team decides to change card density, radii, borders, or chart styling globally
