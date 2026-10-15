// Shared, presentational-only types for Cadence UI.
// NOTE: this library is styling + components ONLY. No HTTP, no app logic.

export type CdsSize = 'sm' | 'md' | 'lg';

export type CdsButtonVariant =
  | 'primary'          // solid green (PDO .btn-primary)
  | 'secondary'        // light-green outline (PDO .btn-secondary)
  | 'secondary-neutral'// gray outline (PDO .btn-secondary-neutral / -border)
  | 'tertiary'         // text-green, no fill (PDO .btn-tertiary)
  | 'ghost'            // borderless green text (PDO .btn-ghost)
  | 'ghost-neutral'    // borderless dark text + grey icon (PDO list Export)
  | 'link'             // padding-less green text link (PDO .btn inline action, e.g. "Edit profile")
  | 'danger'           // solid red (PDO .btn-danger)
  | 'danger-ghost'     // red text (PDO .btn-ghost.negative)
  | 'danger-link'      // padding-less red text link (PDO .btn-ghost.negative inline action)
  | 'light';           // gray-25 fill, body text, no border (PDO .btn-light cancel action)

/** Semantic status variants (alerts, inline states). */
export type CdsStatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary';

/**
 * Badge tones — the full PDO pill palette, driven by tokens (see badge.scss).
 * Semantic tones plus the domain tones used by lead/contract tags so every
 * status pill is one `<cds-badge>` fed a tone, not a bespoke class.
 */
export type CdsBadgeTone =
  | 'neutral'
  | 'muted'
  | 'success'
  | 'primary'
  | 'info'
  | 'danger'
  | 'warning'
  | 'seasoning'
  | 'homeowner'
  | 'takeout'
  | 'forfeited';

export type CdsBadgeStyle = 'soft' | 'softer' | 'solid' | 'outline' | 'bare' | 'text';

/**
 * Badge corner shape — reference-wins per PDO badge family:
 *   'rounded' (8px, radius-sm) = lead-tag / client-category tags
 *   'pill'    (100px, radius-pill) = role / user-status pills, property tags
 */
export type CdsBadgeShape = 'rounded' | 'pill';

/** Lead temperature (agents). Presentational mapping only. */
export type CdsTemperature = 'hot' | 'warm' | 'cold' | 'dormant';

export type CdsAvatarSize = 'xxs' | 'sm' | 'md' | 'lg';

/**
 * Tab group chrome:
 *   'underline' = PDO page tabs (rounded, bottom-bordered active underline)
 *   'plain'     = PDO secondary filter, bare centered text (no underline chrome)
 */
export type CdsTabsVariant = 'underline' | 'plain';
