# Agent · Account settings

The signed-in user's account overview: avatar + name/email, a read-only block of
profile detail rows, and the three ways to edit it — Edit profile, Change address,
Update password.

| | |
|---|---|
| **Route** | `/settings` |
| **POV / access** | **Agent (broker/seller).** Shared settings screen (also used by staff/client); authenticated session, scoped to the current user (`me`). Behind the app shell + auth guard. |
| **Entry points** | Profile menu (top-right user chip) → **Settings** · direct nav to `/settings`. |

## Purpose
Show the user their stored account information at a glance and route them to the
focused sub-forms that change it (profile, address, password). This page itself
is read-only — it displays, it does not edit.

## Data
- **Current user** — `GET /api/users/me/` → avatar, display name, email, and the detail rows below.
- Detail rows (label → value): **Mobile number** · **Date of birth** · **Gender** · **Address**.
- Each sub-form edit emits a success/failure notification (e.g. *Profile updated successfully*, *Password update failed*) — concept 02 §2.5.

## Layout
Inside the app shell:
1. **Top nav** — brand + `a[cds-nav-item]` + help button, notification bell, user chip.
2. **Page header** — `cds-page-header`: title "Account settings" + subtitle "Update your account information".
3. **Profile card** (single column, centred ~500px):
   - **Primary** — `cds-avatar size="lg"` + name (`h4`) + email (`h5`).
   - **Details** — labelled rows: Mobile number · Date of birth · Gender · Address.
   - **Actions** — stacked, left-aligned: **Edit profile** · **Change address** · **Update password**.

## Components (from `@tactivstudios/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — app shell.
- `cds-notif-bell` (`count`) + `cds-user-chip` (`name`, `role`, `src`) — header actions.
- `cds-page-header` (`title`, `subtitle`) — page title block.
- `cds-avatar` (`size="lg"`, `name`, `src`) — profile avatar.
- `button[cds-button] variant="ghost"` — the three edit actions.
- Name/email and the labelled detail rows are plain markup today (no dedicated `cds-*`); if a "detail list" is reused elsewhere, promote it and flag it.

## States
- **Loading** — avatar/name/detail rows show skeleton while `GET /api/users/me/` resolves.
- **Empty (missing field)** — a detail with no stored value renders a placeholder "-" rather than a blank row.
- **Error** — `cds-alert variant="danger"` with Retry (app-wired) if the profile fetch fails.
- **Denied** — unauthenticated users are bounced to `/login` by the auth guard.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Edit profile** | Open the profile form. | — (edit via `PUT /api/users/me/` on that page) | → `/settings/edit-profile` |
| **Change address** | Open the address form. | — (edit via `PUT /api/users/me/` on that page) | → `/settings/update-address` |
| **Update password** | Open the password form. | — (edit via `PUT /api/users/me/password/` on that page) | → `/settings/update-password` |

## Rules / validation
- This page is **read-only**; all mutation happens on the sub-forms it links to.
- Detail values mirror `GET /api/users/me/`; a missing value shows "-".

## Acceptance criteria
- [ ] Page header reads "Account settings" / "Update your account information".
- [ ] Profile card shows avatar + name + email and the four detail rows: Mobile number · Date of birth · Gender · Address.
- [ ] The three actions (Edit profile / Change address / Update password) render as ghost buttons and route to `/settings/edit-profile`, `/settings/update-address`, `/settings/update-password` respectively.
- [ ] Values populate from `GET /api/users/me/`; missing values render "-".
- [ ] Loading / error / denied states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, page-header, avatar, button, notif-bell, user-chip).

## Notes
- Shared settings screen (concept 02 §2.5); the same overview serves staff and client POVs, scoped to `me`.
- Edit profile, Change address, and Update password are pages of their own (each has its own contract).
