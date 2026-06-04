# Design System

## Purpose

This file defines the shared visual system for the whole frontend.

It should be applied everywhere:

- app shell
- dashboards
- detail pages
- settings
- forms
- tables
- charts
- dialogs
- empty states
- support surfaces

Do not treat it as a page-specific reference.

## Brand Tokens

Use these colors as the canonical palette:

- primary teal: `#02A9A2`
- destructive red: `#C1333F`
- warning yellow: `#FFCA00`
- amber-orange: `#EC9E00`
- dark theme base: `#272421`
- light theme base: `#FFFCF7`

## Token Intent

Apply them consistently:

- `#02A9A2`
  - primary actions
  - active states
  - live metrics
  - positive emphasis
  - selected navigation accents

- `#C1333F`
  - destructive actions
  - critical states
  - failures
  - errors
  - severe alerts

- `#FFCA00`
  - warning states
  - attention markers
  - cautionary data highlights

- `#EC9E00`
  - pending states
  - amber alerts
  - secondary warning emphasis

- `#272421`
  - dark background anchor
  - dark shell surfaces
  - dark sidebar and panel family
  - dark foreground counterpart for light mode

- `#FFFCF7`
  - light background anchor
  - light cards and page surfaces
  - light foreground counterpart for dark mode

## Recommended Semantic Mapping

Use a stable semantic token layer on top of the brand colors:

- `--background-dark` from `#272421`
- `--background-light` from `#FFFCF7`
- `--foreground-dark` from `#FFFCF7`
- `--foreground-light` from `#272421`
- `--primary` from `#02A9A2`
- `--success` from `#02A9A2`
- `--destructive` from `#C1333F`
- `--warning` from `#FFCA00`
- `--warning-alt` from `#EC9E00`

Build neutral scales by tinting from the theme anchors, not by introducing unrelated grays.

## Theme Rules

### Background Rule (Non-Negotiable)

- Use solid shell backgrounds only.
- Do not use gradients for page/app backgrounds by default.
- Light mode shell background is `#FFFCF7`.
- Dark mode shell background is `#272421`.
- Brand and status colors are accents, not shell backgrounds.

### Dark Theme

- Base the app shell on `#272421`.
- Use darker and lighter tints of that color for surfaces, cards, sidebars, and borders.
- Use `#FFFCF7` as the main readable foreground anchor.
- Keep contrast strong but not harsh.

### Light Theme

- Base the app shell on `#FFFCF7`.
- Use `#272421` as the primary text anchor.
- Keep surfaces warm and slightly tinted rather than sterile pure white.

## Typography

- Primary family: `JetBrains Mono`
- Use the same typography system across the whole product.
- Keep heading language short and direct.
- Use mono consistently for labels, metrics, metadata, tables, and controls.

## Surface Language

Use one consistent surface treatment everywhere:

- matte surfaces
- thin borders
- compact spacing
- restrained shadows
- `12px` card radius as the default panel/card radius

The UI should feel dense, intentional, and operational rather than airy or decorative.

## Density

Prefer a compact-to-comfortable density across the entire product:

- dense enough for information-rich views
- readable enough for forms and settings
- consistent enough that pages feel related

Do not make one page extremely spacious and another extremely compressed unless there is a strong product reason.

## Status Language

Make state explicit in both color and copy. Reuse a stable vocabulary:

- positive: `Healthy`, `Active`, `Live`, `Success`
- warning: `Warning`, `Pending`, `Attention`
- negative: `Critical`, `Failed`, `Error`, `Down`
- neutral: `Idle`, `Draft`, `Archived`

Color alone should not carry meaning.

## Charts

Charts should inherit the same system:

- primary series: `#02A9A2`
- destructive series: `#C1333F`
- warning series: `#FFCA00`
- amber/pending series: `#EC9E00`
- neutral gridlines and chart chrome derived from theme anchors

Charts should feel like part of the product, not like a separate visual package.

## Guardrails

Do not:

- introduce random per-page accent colors
- use gradient page backgrounds unless the user explicitly requests them
- use unrelated gray palettes
- switch typography systems between sections
- invent new radii on every page
- make one-off charts with arbitrary colors
- let a single page drift away from the shared shell and surface language
