# Component Rules

## Goal

Use these rules to keep common UI pieces consistent across the whole frontend.

## Layout

- Keep page headers concise.
- Use a stable content width strategy across the app.
- Group related information tightly and separate unrelated blocks clearly.
- Prefer dense, structured layouts over oversized empty spacing.
- Keep app/page background solid by theme (`#FFFCF7` light, `#272421` dark), not gradient.

## Navigation

- Keep navigation styling consistent across all sections.
- Use the primary teal accent for active states.
- Keep labels short and clear.
- Avoid section-specific navigation themes.

## Cards And Panels

- Use matte cards with thin borders.
- Default to `12px` radius.
- Keep padding in the compact-to-comfortable range.
- Do not invent new card styles for every feature.

## Tables

- Keep headers compact and legible.
- Use explicit status columns where relevant.
- Keep row spacing aligned with the global density.
- Use semantic colors consistently inside badges and status cells.

## Forms

- Use the same input, label, helper, and error styling everywhere.
- Keep spacing consistent between fields.
- Use `#C1333F` for errors and destructive validation states.
- Use `#02A9A2` for active or confirmed states.

## Tabs And Filters

- Use one shared pattern for tabs, segmented controls, and filters.
- Selected states should use the primary teal.
- Warning-oriented filters may use yellow or amber only when the meaning is semantic.

## Badges And Status Chips

- positive or active: `#02A9A2`
- warning: `#FFCA00`
- pending or amber caution: `#EC9E00`
- destructive: `#C1333F`
- neutral: derive from theme anchors

Always pair color with a readable label.

## Charts

- Keep chart chrome quiet.
- Use semantic series colors from the design system.
- Do not use rainbow palettes without meaning.
- Legends, axes, and labels should match the typography system.

## Empty, Loading, And Error States

- Keep the same surface language as the rest of the app.
- Use concise explanatory copy.
- Use semantic color sparingly and intentionally.
- Do not make these states feel like a different product.

## Modals, Drawers, And Popovers

- Reuse the same surface treatment as cards and panels.
- Keep actions visually consistent with the global button hierarchy.
- Do not create special-purpose color systems inside overlays.
