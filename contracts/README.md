# Cadence — Page Implementation Contracts

This folder holds a **contract per application page**. Each contract is the single,
authoritative spec Claude Code (or any engineer) follows to implement that page in the
**Cadence** app against the `@tactivstudios/cadence-ui` design system.

Every contract has a matching **Storybook page** (`Pages/<POV>/<Name>`) that shows the
high-fidelity target built from real Cadence components, with the contract rendered on the
Docs tab. Contract text lives once in `…/pages/<pov>/<page>.contract.ts` and is mirrored here
as `.md` (run `npm run gen:contracts`) for reading outside Storybook.

## POV grouping

Pages are grouped by point of view — **Staff**, **Agent**, **Client** — matching the three
POVs of the platform. See the `concept/` audit for the full route inventory and flows.

## How to use a contract (for Claude Code)

1. Open the Storybook page (`Pages/<POV>/<Name>`) to see the exact target UI and the
   component composition (use the **Code** panel / Docs **Show code**).
2. Read this contract for the behavior the story cannot show: data sources, states, what every
   CTA does, API endpoints, validation and acceptance criteria.
3. Implement the real Angular page: compose the **same Cadence components**, wire data +
   actions + API calls (the design system is presentational only — it ships no behavior).
4. Verify against the **Acceptance criteria**.

## Contract schema

Each contract uses these sections:

| Section | What it specifies |
|---|---|
| **Route** | The Angular route path (and any params). |
| **POV / access** | Staff / Agent / Client, the RBAC resources required, and route guards. |
| **Purpose** | One or two lines: what the page is for. |
| **Entry points** | How users arrive (nav item, link from another page, deep link). |
| **Data** | The entities + key fields the page reads, and the `GET` endpoints that load them. |
| **Layout** | The page regions top-to-bottom and how they're arranged. |
| **Components** | The exact Cadence components used, and for what. |
| **States** | Loading, empty, error, and permission-denied behavior. |
| **CTAs / actions** | Every button/action → intended behavior, the `POST/PUT/DELETE` endpoint, and resulting navigation. Side-effectful actions are the app's responsibility. |
| **Rules / validation** | Business rules, gating, and field validation the page enforces. |
| **Acceptance criteria** | A checklist an implementer can verify the page against. |
| **Notes** | Edge cases, perf notes, and anything flagged in the QA audit. |

> Contracts describe **intended** behavior and endpoints based on the `concept/` audit of the
> current PDO app. Confirm endpoint shapes against the API when implementing; the design-system
> components and the layout are fixed by the story.
