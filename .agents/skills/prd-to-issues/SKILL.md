---
name: prd-to-issues
description: Break a PRD into independent GitHub issues, with backend-first then frontend-linked workflow. Each issue is fully discussed before implementation. Use when converting a PRD to actionable work items.
---

# PRD to Issues

Break a PRD into **independent GitHub issues**, where each issue is a fully deliverable work item.

## Process

### 1. Locate the PRD

Ask the user for the PRD GitHub issue number or URL.  

If the PRD is not already in your context window, fetch it with: `gh issue view <number> --comments`

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the system.

### 3. Draft issues

Break the PRD into **independent backend and frontend issues**:

- **Backend issues first:** fully implementable, complete, no dependencies on frontend.  
- **Frontend issues second:** fully implementable once backend is ready, each linked to its related backend issue.  

Each issue must be **autonomous** and deliverable on its own. Do not create partial or dependent slices.  

### 4. Discuss implementation before starting

For each issue, **before coding**, discuss:

- Technologies and tools to use (backend and frontend)  
- Architecture, endpoints, schema (backend)  
- Layout, components, interactions (frontend)  
- Any important design decisions or trade-offs  
- Questions or uncertainties  

Iterate discussion until everyone is aligned and the issue can be started with clarity.

### 5. Create GitHub issues

For each approved issue, create a GitHub issue using: `gh issue create`

Create backend issues first, then frontend issues. In each frontend issue, reference its related backend issue.

<issue-template>
## Parent PRD

#<prd-issue-number>

## What to build

A concise description of this issue, describing the **fully deliverable behavior**. Reference specific sections of the parent PRD rather than duplicating content.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
(Optional: tests recommended but not required)

## Blocked by

- None (issues are sequential: backend first, frontend second with reference to backend issue)

## Related backend issue (for frontend only)

- #<backend-issue-number>

## Notes / Implementation discussion

Summarize the agreed decisions from the pre-coding discussion, including technologies, architecture, layout, components, and any points of attention.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

Do NOT close or modify the parent PRD issue.