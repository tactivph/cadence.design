# Client · Property feed

A browsable feed of properties/offerings for the buyer — a project hero banner over a
feed section that lists updates, or an empty state when there are none.

| | |
|---|---|
| **Route** | `/client/property-feed` |
| **POV / access** | **Client (buyer).** Authenticated client session; scoped to the buyer's own prospect/contract. Behind the client shell + auth guard. |
| **Entry points** | Client shell top-nav **Property feed**. |

## Purpose
Let the buyer explore properties/units tied to their prospect or contract and see feed
updates about the development they're buying into.

## Data
- **Feed project / hero** — the buyer's development/unit (name, location, unit tier) — backed by `GET /api/developments/public-view/` and `/api/properties/*` `(confirm)`.
- **Feed items** — property updates/offerings for the buyer `(confirm)`.
- Options/lookups via the development options endpoints `(confirm)`.

## Layout
Inside the client shell:
1. **Hero banner** — full-width project image with overlay: project name (e.g. "Westwoods"), a `cds-badge` ("Premium unit"), and a location line (map-pin + "Cagayan de Oro, Misamis Oriental").
2. **Feed section** — heading "Property Feed" over the feed list; `cds-empty-state` "No updates yet" when empty.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — client shell (Property feed active).
- `cds-notif-bell` · `cds-user-chip` — header actions.
- `cds-badge` — the unit-tier badge in the hero (solid, success).
- `cds-empty-state` — the "No updates yet" empty feed.

## States
- **Loading** — skeleton hero + feed placeholders.
- **Empty** — `cds-empty-state` "No updates yet" (default captured state).
- **Error** — `cds-alert variant="danger"` with Retry.
- **Denied** — redirect to client home / 403 if no contract scope.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Feed item** | Open the property/update detail. | — `(confirm)` | property/update detail `(confirm)` |
| **Notif bell** | Open notifications dropdown. | `GET /api/users/notifications/` | — |

## Rules / validation
- Feed is scoped to the buyer's own prospect/contract.
- Hero reflects the buyer's assigned development/unit.

## Acceptance criteria
- [ ] Hero banner renders project name, unit badge, and location line.
- [ ] Feed section shows items when present and the "No updates yet" empty state otherwise.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components.

## Visibility rule (PO decided, pdo parity, 2026-10-17)
Final PO decisions (supersede the earlier "available only" proposal; recorded on CAD-85 / CAD-90 and in `concept/config/DECISIONS.md`). There is **no availability narrowing**.
1. **Units:** a buyer sees all units with their status (Available, Sold/Reserved, On-Hold), as pdo does; sold and on-hold lots are not excluded (applies to the site map, `site-map.md`; `pdo/api/developments/views/development.py:870-887`).
2. **Own unit:** a buyer always sees the unit they hold a contract on, regardless of its status.
3. **Sites:** only sites with a published map, limited to the buyer's active region (`pdo/api/developments/managers.py:35-40`, `pdo/api/developments/views/development.py:61-75`); pdo scope, unchanged.
4. **Property feed:** no inventory rule. The feed stays limited to the buyer's own contract updates, as pdo does (`pdo/web/src/app/pages/client/property-feed/property-feed.component.ts:28-31,52-62`). The hero shows only the buyer's own contracted unit.

## Notes
- The captured reference shows the empty feed only; feed-item shape and detail route are unconfirmed — marked `(confirm)`.
- Backing endpoints are inferred from the concept audit (`06 §6.4`); confirm shapes against the API when implementing.
