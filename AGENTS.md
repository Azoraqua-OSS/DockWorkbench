# DockWorkbench Agent Rules

## Scope & Priority
- Primary scope: Next.js app and frontend logic (`src/**`).
- Secondary scope: Rust/Tauri (`src-tauri/**`) is lower priority; use common practices or leave untouched unless explicitly requested.

## Communication Style
- Keep non-code responses concise and minimal.
- Prioritize execution efficiency and context/token efficiency.

## Project Map (for orientation)
- App entry/layout: `src/app/layout.tsx`, `src/app/page.tsx`
- Product UI components: `src/components/custom/**`
- Shared UI kit (read-only): `src/components/ui/**`
- Header/sidebar shell: `src/components/layout/header.tsx`
- Server state/persistence: `src/stores/server-store.ts`
- Connector config/validation: `src/app/_connectors.tsx`, `src/lib/schemas/connectors.ts`
- Storybook config: `.storybook/**` (read-only)

## Required Command Workflow (for code changes)
Run these commands in this order:
1. `pnpm exec tsc --noEmit`
2. `pnpm format`
3. `pnpm lint --fix`

Notes:
- `lint` maps to Biome (`biome check`), and `--fix` is valid.
- If auto-fix does not fully resolve issues, only do manual fixes when needed to unblock execution or requested outcomes; otherwise report briefly.

## UI Change Workflow (when asked to alter UI)
- Use Storybook and Playwright when the task is a UI change request.
- Preferred runtime setup:
  - `pnpm dev:tauri` (runs app + Storybook), or
  - `pnpm dev` and `pnpm storybook`
- Use Playwright to verify interactions/visual regressions.
- Use screenshot capture when explicitly requested.

## Hard No-Touch Rules
Do NOT alter:
- `src/components/ui/**`
- `.next/**`
- `.playwright-cli/**`
- `.storybook/**`
- `out/**`
- `output/**`
- `src-tauri/gen/**`
- `src-tauri/target/**`
- `tsconfig.tsbuildinfo`
- `*.*lock*`
- `*.log*`
- `*.env*`

## Additional File Preferences
- Prefer NOT to alter `.d.ts` files.
- Keep changes focused in feature-specific files (`src/components/custom/**`, `src/app/**`, `src/stores/**`, `src/lib/**`) unless task requires broader edits.

## Execution Principles
- Discover project context and tooling before editing.
- Respect prior architecture and existing abstractions.
- Avoid unnecessary refactors outside task scope.
