# Implementation Guide

## Goal

Apply the design system to every frontend surface so the product reads as one coherent interface.

## Build Order

1. Start from tokens.
2. Apply the theme anchors.
3. Reuse the same typography.
4. Reuse the same surface language.
5. Reuse the same component behaviors.
6. Check the page against the system before finishing.

## 1. Start From Tokens

Every new UI surface should inherit:

- `#02A9A2`
- `#C1333F`
- `#FFCA00`
- `#EC9E00`
- `#272421`
- `#FFFCF7`

If you need another color, derive it from these anchors instead of inventing a disconnected palette.

## 2. Apply Theme Anchors

Background policy:

- shell/page background must be a solid color (no gradients by default)
- light shell background: `#FFFCF7`
- dark shell background: `#272421`
- `#02A9A2`, `#C1333F`, `#FFCA00`, `#EC9E00` are semantic accents, not shell fills

### Dark mode

- use `#272421` as the shell anchor
- derive cards, sidebars, borders, and muted surfaces from it
- use `#FFFCF7` for readable contrast

### Light mode

- use `#FFFCF7` as the shell anchor
- use `#272421` for the main foreground
- keep warm neutrals instead of stark black and white

## 3. Preserve Typography

- use `JetBrains Mono` across the whole frontend
- keep headings short
- keep labels explicit
- keep metadata compact and readable

Do not switch to a second visual language on isolated pages.

## 4. Preserve Surface Rules

Use the same defaults across all frontend work:

- `12px` card radius
- thin borders
- matte cards and panels
- restrained shadows
- compact or comfortable density

## 5. Use Semantic Color Consistently

- primary and active: `#02A9A2`
- destructive and critical: `#C1333F`
- warning: `#FFCA00`
- amber or pending: `#EC9E00`

Do not swap meanings from page to page.

## 6. Write Consistent UI Copy

- use concise headings
- use short supporting text
- expose state clearly
- avoid decorative marketing language in product UI

## 7. Keep Pages In The Same Family

Even when page layouts differ, they should still share:

- the same shell
- the same colors
- the same typography
- the same spacing rhythm
- the same surface treatment
- the same interaction grammar

## 8. Finishing Checklist

Before shipping a page or component, confirm:

- colors come only from the system palette or its derived tints
- typography matches the rest of the app
- cards and panels use the shared surface language
- states are explicit and semantic
- charts use the same semantic colors
- the page does not feel like a separate mini-brand
