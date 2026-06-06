# Legacy Context

`the-big-long/` is a legacy snapshot/submodule from the previous iteration of the project.

## Current source of truth
- The active app lives at the repository root.
- Work on `app/`, `components/`, `hooks/`, `lib/`, `styles/`, and `types/` at the root.

## Do not use as the active app
- `the-big-long/` is kept only for historical reference and context.
- Its old Vite-era files are not the current implementation.

## Practical rule
- If a change is meant for production, edit the root files only.
- If you need historical comparison, inspect `the-big-long/` without copying it back into the active app unless explicitly intended.
