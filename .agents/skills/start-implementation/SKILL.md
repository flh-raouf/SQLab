---
name: start-implementation
description: Implements a GitHub issue continuously until finished, documents the work and recommendations, commits, and closes the issue. Confirms the issue with the user only if it is not already in context.
---

# Start Implementation

This skill ensures an issue is fully implemented without interruption, then documents the work, provides recommendations, commits changes, and closes the issue. Confirmation is required only if the issue is not already in the context.

## Process

### 1. Check issue context

- Determine if the issue to implement is already confirmed in the conversation context.  
- If it is not confirmed, present the issue to the user for confirmation:  
  - **Title**  
  - **Issue number**  
  - **Type** (backend / frontend)  
  - **Blocked by / Dependencies**  
- If it is already confirmed, skip this step.

### 2. Begin implementation

- Implement all functionality required by the issue **without pausing or switching tasks**.  
- Follow the pre-discussed plan for implementation.  
- Include necessary coding, documentation, and integration work as part of the flow.

### 3. Document work upon completion

Once the implementation is complete:

- Write a detailed summary in the GitHub issue:  
  - **What was implemented:** step-by-step explanation of completed work.  
  - **Recommendations for other issues:** insights, dependencies, or best practices discovered.  

### 4. Commit and close the issue

- Commit all changes with a clear commit message referencing the issue number.  
- Close the GitHub issue after committing.

### 5. Notes

- The implementation must **continue uninterrupted** until fully completed.  
- Recommendations should be actionable and relevant for the remaining PRD issues.