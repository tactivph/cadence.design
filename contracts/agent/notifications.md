# Notifications

The full-page notification timeline: every alert the user has received — site-visit
reminders, lead assignments, signed documents, approvals, payments — grouped under
**All** and **Unread**, with a one-tap **Mark all as read**.

| | |
|---|---|
| **Route** | `/notifications` |
| **POV / access** | **Shared screen, documented from the Agent POV.** Authenticated session (any POV); behind the app shell + auth guard. The top-nav chrome and scope follow the signed-in user's POV. |
| **Entry points** | Header **bell** dropdown → "View all notifications" · the bell itself · each notification deep-links to its subject. |

## Purpose
Give the user one place to review their full notification history, tell read from unread
at a glance, clear the unread count in a single action, and jump from any item to the
thing it is about (endorsement, visit, requirement, etc.).

## Data
- **Notifications** — `GET /api/users/notifications/` (the timeline; paginated/live).
- **Unread count** — `GET /api/users/notifications/stats/` (drives the bell badge + the "Unread (n)" tab label).
- Live updates arrive via **WebSocket** (concept 02 §2.6).
- Notification shape (`Notif`): `icon` · `title` · `subtext` (body) · `time` (relative) · `unread`.
- Each item carries a subject deep-link (endorsement / visit / requirement / etc.; catalog in concept 01 §7).

## Layout
Inside the app shell:
1. **Top nav** — brand + `a[cds-nav-item]` + help button, notification bell, user chip (no nav item is active — this is a shared/overlay page).
2. **Header row** — `h1` "Notifications" + **Mark all as read** (small secondary-neutral button, `iconLeft`).
3. **Tabs + timeline** — `cds-tabs` with **All** and **Unread (n)** tabs; each tab holds a `timeline` of `cds-card` items: leading status icon (unread-emphasised) + title + subtext + relative time. Unread items carry an unread accent.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — app shell.
- `cds-notif-bell` (`count`) + `cds-user-chip` (`name`, `role`, `src`) — shell header actions.
- `button[cds-button]` (`variant="secondary-neutral"`, `size="sm"`, `iconLeft`) — **Mark all as read**.
- `cds-tabs` + `cds-tab` (`label`) — **All** / **Unread (n)**.
- `cds-card` — each notification timeline item.
- The leading icon chip and the unread accent are plain markup inside the card today (no dedicated `cds-notification-item`); if the timeline item is reused, flag promoting it to a `cds-*`.

## States
- **Loading** — timeline shows skeleton cards (header/tabs fixed).
- **Empty (All)** — `cds-empty-state` "You're all caught up" (app-wired).
- **Empty (Unread)** — `cds-empty-state` "No unread notifications"; the tab label reads "Unread (0)".
- **Error** — `cds-alert variant="danger"` with Retry (app-wired).
- **Unread emphasis** — unread items render the accented icon + unread card styling; read items render muted.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **All / Unread tab** | Switch between the full timeline and the unread-only subset. | filters loaded data (re-query `GET /api/users/notifications/?unread` if server-filtered — confirm) | stays |
| **Mark all as read** | Clear every unread item (and the bell badge). | `PUT /api/users/notifications/mark_all_as_read/` | stays (list refreshes, count → 0) |
| **Notification item click** | Mark the item read + open its subject. | `PUT /api/users/notifications/:id/mark_as_read/` | subject deep-link (endorsement / visit / requirement / …) |
| **(On view)** | Mark surfaced items as seen (clears "new" without marking read). | `PUT /api/users/notifications/mark_as_seen/` | — |

## Rules / validation
- The **Unread (n)** tab label and the bell badge both reflect the current unread count from `.../stats/`.
- **Mark all as read** clears all unread state and drops the count to 0.
- Clicking an item marks it read and navigates to its subject (the two happen together).
- The timeline is live: WebSocket pushes prepend new items and bump the unread count without a reload.

## Acceptance criteria
- [ ] Header renders "Notifications" + **Mark all as read** (`cds-button` secondary-neutral, small, with checks icon).
- [ ] `cds-tabs` renders **All** and **Unread (n)** with the count in the Unread label.
- [ ] Each timeline entry is a `cds-card` with leading icon, title, subtext, and relative time; unread entries are visually emphasised.
- [ ] Mark all as read calls `PUT /api/users/notifications/mark_all_as_read/` and clears the unread count; an item click calls `.../:id/mark_as_read/` and opens its subject.
- [ ] Unread count + Unread tab label derive from `GET /api/users/notifications/stats/`.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, tabs + tab, card, notif-bell, user-chip).

## Notes
- Shared screen (concept 02 §2.6): the same page serves every POV; the shell chrome follows the signed-in user. Documented here from the Agent POV; staff/client reuse the composition.
- The header **bell dropdown** is a condensed version of this page (same All / Unread tabs + mark-all-read, plus a "View all notifications" link back here) — a separate component, not this route.
- Subject deep-link targets vary by notification type (catalog: concept 01 §7); tab server-filtering and the seen/read split are marked (confirm) pending API audit.
