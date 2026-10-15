/**
 * Page contract — Client · Site map.
 * Single source of truth; mirrored to contracts/client/site-map.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Client · Site map

The buyer's interactive developments/sites viewer — a searchable "Sites" list that lets
the buyer explore available sites and lots, with an empty state when none are available.

| | |
|---|---|
| **Route** | \`/client/site-map\` |
| **POV / access** | **Client (buyer).** Authenticated client session. Behind the client shell + auth guard. |
| **Entry points** | Client shell top-nav **Site Map**. |

## Purpose
Give the buyer the same interactive developments map/sites viewer (shared component) to
explore sites and lots available to them.

## Data
- **Sites / developments** — the list of sites available to the buyer, backed by the developments endpoints (\`/api/developments/public-view/\`, options endpoints) \`(confirm)\`.
- **Search** — client-side or query-param filter over the sites list \`(confirm)\`.

## Layout
Inside the client shell:
1. **Page head** — title "Sites" with a search \`cds-input-group\` (magnifying-glass prefix, "Search" placeholder) on the right.
2. **Body** — the sites viewer; \`cds-empty-state\` (house icon, "No Sites Yet", "No sites are available at this time.") when empty.

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — client shell (Site Map active).
- \`cds-avatar\` + \`cds-badge\` — user chip + notification badge in the header.
- \`cds-input-group\` + \`cdsInput\` — the search box.
- \`cds-empty-state\` — the "No Sites Yet" empty state.

## States
- **Loading** — skeleton/spinner while sites load.
- **Empty** — \`cds-empty-state\` "No Sites Yet" (default captured state).
- **Error** — \`cds-alert variant="danger"\` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Search** | Filter the sites list. | — \`(confirm)\` | stays |
| **Site / lot** | Open the site/lot detail in the viewer. | — \`(confirm)\` | site detail \`(confirm)\` |

## Rules / validation
- Search filters the visible sites; empty result keeps the empty state messaging.

## Acceptance criteria
- [ ] Page head shows "Sites" title and a working search input.
- [ ] Sites render when present; the "No Sites Yet" empty state shows otherwise.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- Shares the developments map/sites viewer used across POVs (\`06 §6.6\`).
- The captured reference shows the empty state only; site-list item shape, search endpoint, and detail route are unconfirmed — marked \`(confirm)\`.
`;
