// =============================================================================
// Cadence UI — Status presets (presentational config, NOT behavior)
// The SINGLE source mapping PDO domain status codes → { label, tone }.
// Every status pill is one <cds-badge> fed a tone; no bespoke per-status CSS.
// Labels + tones are extracted verbatim from the PDO components
// (lead-tag, status-badge, requirement-status, lead-temperature).
// Data only — no API calls, no state.
// =============================================================================
import { CdsBadgeTone, CdsTemperature } from './types';

export interface CdsStatusPreset {
  label: string;
  tone: CdsBadgeTone;
}

/**
 * Client / lead category (lead.current_status) — the Clients & Leads list
 * "Category" column. Mirrors PDO `pdo-lead-tag`.
 */
export const CDS_CLIENT_CATEGORY: Record<string, CdsStatusPreset> = {
  available:       { label: 'Available',       tone: 'neutral' },
  expired:         { label: 'Expired',         tone: 'neutral' },
  terminated:      { label: 'Terminated',      tone: 'neutral' },
  unavailable:     { label: 'Unavailable',     tone: 'danger' },
  signed_cas:      { label: 'Signed CAS',      tone: 'success' },
  endorsed:        { label: 'Endorsed',        tone: 'warning' },
  reserved_buyer:  { label: 'Reserved Buyer',  tone: 'primary' },
  seasoning_buyer: { label: 'Seasoning Buyer', tone: 'seasoning' },
  takeout_buyer:   { label: 'Takeout Buyer',   tone: 'takeout' },
  homeowner:       { label: 'Homeowner',       tone: 'homeowner' },
  forfeited:       { label: 'Forfeited',       tone: 'forfeited' },
  active:          { label: 'Active',          tone: 'success' },
  inactive:        { label: 'Inactive',        tone: 'danger' },
  declined:        { label: 'Declined',        tone: 'danger' },
  pending:         { label: 'Pending',         tone: 'muted' },
  invited:         { label: 'Invited',         tone: 'neutral' },
};

/** Lead sales-funnel progress (Lead.Progress) — dark slate chip in PDO. */
export const CDS_LEAD_PROGRESS: Record<string, CdsStatusPreset> = {
  new_lead:                   { label: 'New Lead',                     tone: 'neutral' },
  engaged_qualified:          { label: 'Engaged & Qualified',          tone: 'info' },
  site_visit_scheduled:       { label: 'Site Visit Scheduled',         tone: 'info' },
  site_visit_completed:       { label: 'Site Visit Completed',         tone: 'primary' },
  unit_computation_finalized: { label: 'Unit & Computation Finalized', tone: 'warning' },
  reserved:                   { label: 'Reserved',                     tone: 'success' },
  dropped:                    { label: 'Dropped',                      tone: 'danger' },
};

/** Contract / buyer lifecycle (ContractStatus). */
export const CDS_CONTRACT_STATUS: Record<string, CdsStatusPreset> = {
  pending:         { label: 'Pending Endorsement', tone: 'muted' },
  endorsed:        { label: 'Endorsed',            tone: 'warning' },
  reserved_buyer:  { label: 'Reserved Buyer',      tone: 'primary' },
  seasoning_buyer: { label: 'Seasoning Buyer',     tone: 'seasoning' },
  takeout_buyer:   { label: 'Takeout Buyer',       tone: 'takeout' },
  homeowner:       { label: 'Homeowner',           tone: 'homeowner' },
  expired:         { label: 'Reservation Expired', tone: 'danger' },
  terminated:      { label: 'Terminated',          tone: 'neutral' },
  declined:        { label: 'Endorsement Declined',tone: 'danger' },
};

/**
 * Requirement verification (UserRequirementStatus) — mirrors PDO
 * `pdo-requirement-status`.
 */
export const CDS_REQUIREMENT_STATUS: Record<string, CdsStatusPreset> = {
  draft:      { label: 'No submission yet',  tone: 'muted' },
  submission: { label: 'Set for submission', tone: 'info' },
  for_review: { label: 'Pending',            tone: 'muted' },
  approved:   { label: 'Verified',           tone: 'success' },
  rejected:   { label: 'For Revision',       tone: 'danger' },
};

/**
 * Endorsement / review request status — mirrors PDO `pdo-status-badge`
 * (the newer clean component). Includes its icons.
 */
export const CDS_REVIEW_STATUS: Record<string, CdsStatusPreset & { icon?: string }> = {
  for_review: { label: 'Pending review', tone: 'warning', icon: 'ph-bold ph-hourglass-medium' },
  approved:   { label: 'Approved',       tone: 'success', icon: 'ph-bold ph-check-circle' },
  declined:   { label: 'Returned',       tone: 'danger',  icon: 'ph-bold ph-arrow-u-up-left' },
  returned:   { label: 'Returned',       tone: 'danger',  icon: 'ph-bold ph-arrow-u-up-left' },
  pending:    { label: 'Pending',        tone: 'warning', icon: 'ph-bold ph-hourglass-medium' },
  verified:   { label: 'Verified',       tone: 'success', icon: 'ph-bold ph-check-circle' },
};

/** Lead temperature → label + tone (PDO uses pastel bg; see cds-lead-temperature). */
export const CDS_TEMPERATURE: Record<CdsTemperature, CdsStatusPreset> = {
  hot:     { label: 'Hot',     tone: 'danger' },
  warm:    { label: 'Warm',    tone: 'warning' },
  cold:    { label: 'Cold',    tone: 'info' },
  dormant: { label: 'Dormant', tone: 'muted' },
};
