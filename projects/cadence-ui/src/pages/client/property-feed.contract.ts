/**
 * Page contract — Client · Property feed.
 * Single source of truth; mirrored to contracts/client/property-feed.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Client · Property feed

A browsable feed of properties/offerings for the buyer — a project hero banner over a
feed section that lists updates, or an empty state when there are none.

| | |
|---|---|
| **Route** | \`/client/property-feed\` |
| **POV / access** | **Client (buyer).** Authenticated client session; scoped to the buyer's own prospect/contract. Behind the client shell + auth guard. |
| **Entry points** | Client shell top-nav **Property feed**. |

## Purpose
Let the buyer explore properties/units tied to their prospect or contract and see feed
updates about the development they're buying into.

## Data
- **Feed project / hero** — the buyer's development/unit (name, location, unit tier) — backed by \`GET /api/developments/public-view/\` and \`/api/properties/*\` \`(confirm)\`.
- **Feed items** — property updates/offerings for the buyer \`(confirm)\`.
- Options/lookups via the development options endpoints \`(confirm)\`.

## Layout
Inside the client shell:
1. **Hero banner** — full-width project image with overlay: project name (e.g. "Westwoods"), a \`cds-badge\` ("Premium unit"), and a location line (map-pin + "Cagayan de Oro, Misamis Oriental").
2. **Feed section** — heading "Property Feed" over the feed list; \`cds-empty-state\` "No updates yet" when empty.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — client shell (Property feed active).
- \`cds-notif-bell\` · \`cds-user-chip\` — header actions.
- \`cds-badge\` — the unit-tier badge in the hero (solid, success).
- \`cds-empty-state\` — the "No updates yet" empty feed.

## States
- **Loading** — skeleton hero + feed placeholders.
- **Empty** — \`cds-empty-state\` "No updates yet" (default captured state).
- **Error** — \`cds-alert variant="danger"\` with Retry.
- **Denied** — redirect to client home / 403 if no contract scope.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Feed item** | Open the property/update detail. | — \`(confirm)\` | property/update detail \`(confirm)\` |
| **Notif bell** | Open notifications dropdown. | \`GET /api/users/notifications/\` | — |

## Rules / validation
- Feed is scoped to the buyer's own prospect/contract.
- Hero reflects the buyer's assigned development/unit.

## Acceptance criteria
- [ ] Hero banner renders project name, unit badge, and location line.
- [ ] Feed section shows items when present and the "No updates yet" empty state otherwise.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- The captured reference shows the empty feed only; feed-item shape and detail route are unconfirmed — marked \`(confirm)\`.
- Backing endpoints are inferred from the concept audit (\`06 §6.4\`); confirm shapes against the API when implementing.
`;
