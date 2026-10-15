import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
  CdsButtonComponent, CdsInputGroupComponent, CdsInputDirective,
  CdsEmptyStateComponent, CdsNotifBellComponent, CdsUserChipComponent,
} from '../../public-api';

/**
 * MOCK page — Staff · Requests Processor (`/staff/requests/processor`,
 * `ProcessorsComponent`).
 *
 * SOURCE-FIRST port of PDO `processors.component.html`. The screen is a
 * processing-request queue (`.clients-list-page .leads`): a header row with the
 * "Processor" heading + funnel/search actions, then one of three conditional
 * bodies — the loaded table, the "No results found" (filtered) empty state, or
 * the DEFAULT empty state when there are no pending requirements.
 *
 * Captured reference (selector `app-root`) is the DEFAULT EMPTY branch
 * (`@else if (!processorList.length && !isLoading)`): the `.clients-header`
 * (h1 "Processor" + funnel + search), then the `.table-empty-state` with the
 * ph-fill ph-file icon, h4 "No pending requirements" and the subtitle
 * "Great work! This page clears…". This mock mirrors that exact composition.
 *
 * Shell: the STAFF top-nav shell is in frame (copied verbatim from the sibling
 * staff approvals-list page: brand wordmark, staff nav items, Admin caret, notif
 * bell, user chip "Tactiv A." / Staff). The reference highlights "Processor"
 * (white text on the filled green pill) → that is the ACTIVE nav item.
 *
 * Structure mirrors processors.component.html 1:1 for the empty branch:
 *   .leads (flex column, gap 24px)
 *     ├ clients-header (.w-100)   → h1 "Processor" (left) · funnel + search (right)
 *     └ table-empty-state         → ph-file icon + h4 title + subtitle message
 *
 * Presentational only (no search / filtering / data-loading).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - .clients-header (heading + actions) → cds-page-header with the funnel
 *     button + search in the [cds-page-actions] slot; the PDO header is a bespoke
 *     flex row, there is no dedicated header component.
 *   - The funnel filter button is a PDO ngbDropdown trigger (nested category /
 *     broker / product / days-left filter menu); there is no cds dropdown
 *     trigger, so it renders as a borderless ghost-neutral icon button.
 *   - The loaded table + pagination and the "No results found" filtered-empty
 *     branch are the other two conditionals (hidden in the captured empty state)
 *     and are omitted from this static story.
 */
@Component({
  selector: 'cds-page-staff-requests-processor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
    CdsButtonComponent, CdsInputGroupComponent, CdsInputDirective,
    CdsEmptyStateComponent, CdsNotifBellComponent, CdsUserChipComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item [active]="true">Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <section class="leads">
        <!-- clients-header: h1 "Processor" (left), funnel + search (right) -->
        <cds-page-header class="clients-header" title="Processor">
          <div cds-page-actions class="clients-header__actions">
            <button cds-button variant="ghost-neutral" [iconOnly]="true" iconLeft="ph-bold ph-funnel" aria-label="Filters"></button>
            <cds-input-group class="clients-header__search">
              <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
              <input cdsInput type="search" placeholder="Search" />
            </cds-input-group>
          </div>
        </cds-page-header>

        <!-- Default empty state: no pending requirements -->
        <div class="table-empty-state">
          <cds-empty-state
            icon="ph-fill ph-file"
            title="No pending requirements"
            message="Great work! This page clears as you complete processing requirements. Stay on top of tasks to keep it empty!">
          </cds-empty-state>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }

    /* brand wordmark (stand-in for the onePDO logo) */
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    /* .leads — flex column, 24px gap between header and body (PDO .leads gap) */
    .leads { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* clients-header actions: funnel icon button + search (PDO .actions gap 16px) */
    .clients-header__actions { display: flex; align-items: center; gap: var(--cds-space-16); }
    /* PDO search input is ~224px wide, right-aligned in the header */
    .clients-header__search { width: 224px; max-width: 100%; }
    /* PDO search input padding: 11px top/bottom, 16px right, 40px left (icon) */
    :host ::ng-deep .clients-header__search {
      padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40);
    }

    /* table-empty-state — PDO centers the empty block in a tall container
       (blueprint .table-empty-state: y=171, h=715) so the title lands near
       y=544, not pinned to the top of the content column. */
    .table-empty-state { display: flex; align-items: center; justify-content: center; min-height: 715px; }

    /* PAGE-LOCAL type alignment to PDO (reference-wins over the default ramps),
       expressed with shared Cadence tokens — no magic numbers.
       • "Processor" header: PDO renders this heading on the DS heading-h4 ramp
         (20px / 24px), not the cds-page-header default heading-h3 (22px / 26px).
       • Empty-state title/subtitle: PDO renders them larger than the shared
         cds-empty-state defaults (heading-h6 / body-sm). Size + line-height are
         corrected here. These labels live inside shared components, so the
         override is applied via ::ng-deep (scoped to this page) rather than by
         touching the shared component files. */
    :host ::ng-deep .clients-header .cds-page-header__title {
      font-size: var(--cds-font-size-2xl);   /* 20px — DS heading-h4 size */
      line-height: var(--cds-space-24);       /* 24px */
    }
    :host ::ng-deep .cds-empty__title {
      font-size: var(--cds-font-size-2xl);   /* 20px */
      line-height: var(--cds-space-24);       /* 24px */
      font-family: var(--cds-font-family-semibold-face); /* Inter SemiBold */
    }
    :host ::ng-deep .cds-empty__message {
      font-size: var(--cds-font-size-lg);    /* 16px */
      line-height: var(--cds-space-24);       /* 24px */
    }
  `],
})
export class StaffRequestsProcessorPage {}
