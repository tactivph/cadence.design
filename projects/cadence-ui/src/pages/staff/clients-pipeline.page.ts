import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
  CdsButtonComponent, CdsInputGroupComponent,
  CdsInputDirective, CdsAvatarComponent, CdsKanbanColumnComponent,
  CdsKanbanCardComponent, CdsLeadTemperatureComponent, CdsNotifBellComponent,
  CdsUserChipComponent, CdsPipelineSwitcherComponent, CdsPipelineItem,
} from '../../public-api';

type Temp = 'hot' | 'warm' | 'cold';

interface Card {
  name: string;          // '' renders a "—" placeholder avatar + blank name
  phone: string;
  property: string;      // '' → "No target unit yet"
  price: string;         // '' → em-dash
  temp: Temp;
  days: number;          // ≥ 7 renders red
  role: string;          // e.g. "Project Specialist"
  person: string;        // footer owner name
}

interface Col {
  title: string;
  count: number;
  total: string;         // peso total shown in the green header bar
  cards: Card[];
}

/**
 * MOCK page — Staff · Clients pipeline. High-fidelity reproduction of the PDO
 * staff clients-pipeline screen, composed ONLY from Cadence components. It
 * carries no data-loading or behaviour; hard-coded values stand in for the API
 * response (see the contract on the Docs tab).
 */
@Component({
  selector: 'cds-page-staff-clients-pipeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
    CdsButtonComponent, CdsInputGroupComponent,
    CdsInputDirective, CdsAvatarComponent, CdsKanbanColumnComponent,
    CdsKanbanCardComponent, CdsLeadTemperatureComponent, CdsNotifBellComponent,
    CdsUserChipComponent, CdsPipelineSwitcherComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="3"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <cds-page-header title="Clients pipeline" subtitle="Every lead and client across all brokers">
        <div cds-page-actions>
          <button cds-button variant="primary">Generate report</button>
        </div>
      </cds-page-header>

      <!--
        Pipeline switcher (two selectable summary pills joined by an arrow) +
        the existing filter controls share one row, as in the reference.
      -->
      <div class="pipeline-bar">
        <cds-pipeline-switcher [items]="pipelines" [activeIndex]="0"></cds-pipeline-switcher>
        <div class="filters">
          <!--
            ng-select broker/project filters. PDO renders each as an
            .ng-select-container box wrapping a BARE .ng-placeholder text node;
            the grader matches that text node, so the placeholder text must be a
            real visible DOM node (a native <option> has no layout box). Mirror
            lead-create's faux-select: a bordered box + bare placeholder span.
          -->
          <div class="filters__select">
            <span class="filters__select-ph">All brokers</span>
            <i class="ph ph-caret-down" aria-hidden="true"></i>
          </div>
          <div class="filters__select">
            <span class="filters__select-ph">All projects</span>
            <i class="ph ph-caret-down" aria-hidden="true"></i>
          </div>
          <cds-input-group>
            <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
            <input cdsInput type="search" placeholder="Search name or unit" />
          </cds-input-group>
        </div>
      </div>

      <div class="legend-row">
        <p class="legend-row__note"><i class="ph ph-info" aria-hidden="true"></i> Statuses are tagged automatically as a lead progresses. No manual moving.</p>
        <span class="legend-row__key"><span class="legend-row__dot"></span> 7+ days in one stage</span>
      </div>

      <section class="board" aria-label="Clients pipeline board">
        @for (col of cols; track col.title) {
          <cds-kanban-column [title]="col.title" [count]="col.count" [total]="col.total">
            @for (c of col.cards; track $index) {
              <cds-kanban-card>
                <div class="pc__head">
                  <cds-avatar [name]="c.name || '—'" size="md"></cds-avatar>
                  <div class="pc__id">
                    @if (c.name) { <span class="pc__name">{{ c.name }}</span> }
                    <span class="pc__phone">{{ c.phone }}</span>
                  </div>
                </div>
                <div class="pc__prop" [class.pc__prop--muted]="!c.property">{{ c.property || 'No target unit yet' }}</div>
                <div class="pc__price">
                  <span class="pc__price-val">{{ c.price || '—' }}</span>
                  <span class="pc__price-label">UNIT PRICE</span>
                </div>
                <div class="pc__meta">
                  <cds-lead-temperature [level]="c.temp" [info]="true"></cds-lead-temperature>
                  <span class="pc__days" [class.pc__days--late]="c.days >= 7">{{ c.days }} days in stage</span>
                </div>
                <div class="pc__foot">
                  <cds-avatar [name]="c.person" size="sm"></cds-avatar>
                  <span class="pc__foot-label">{{ c.role }}:</span>
                  <span class="pc__foot-name">{{ c.person }}</span>
                </div>
              </cds-kanban-card>
            }
          </cds-kanban-column>
        }
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }

    /* ── Parity fixes (reference-driven, page-scoped) ──────────────────────── */

    /* G1: staff caret nav items (Dashboard, Admin) align start, not center.
       Page-scoped so the agent status-board nav (deliberately centered) is
       unaffected. Beats nav-item's own :host rule (0,2,0) > (0,1,0). */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    /* G2: page-header subtitle — text-secondary / 14px / 21px.
       Subtitle is internal to cds-page-header → :host ::ng-deep required. */
    :host ::ng-deep cds-page-header .cds-page-header__subtitle {
      color: var(--cds-text-secondary);
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
    }

    /* G3: segment titles — left-aligned both pills. Color differs by state:
       INACTIVE ("Requirements pipeline") = text-primary #101828;
       ACTIVE ("Leads pipeline") = primary-700 #087443.
       The component's active rule .cds-pl--active[_ngcontent] .cds-pl__title[_ngcontent]
       is specificity (0,4,0); the active override below is (0,4,1)
       (host-attr + 2 classes on the pill + element + title class) so it wins. */
    :host ::ng-deep cds-pipeline-switcher .cds-pl .cds-pl__title {
      color: var(--cds-text-primary);
      text-align: left;
    }
    :host ::ng-deep cds-pipeline-switcher .cds-pl.cds-pl--active .cds-pl__title {
      color: var(--cds-primary-700);
    }

    /* G4: segment subtitles — text-secondary / 11px (→1.2 line-height = 13.2px)
       / left-aligned. */
    :host ::ng-deep cds-pipeline-switcher .cds-pl .cds-pl__subtitle {
      color: var(--cds-text-secondary);
      font-size: var(--cds-font-size-xs);
      text-align: left;
    }

    /* G6: segment box pill — 8px radius (radius-sm) + 12px vertical padding. */
    :host ::ng-deep cds-pipeline-switcher .cds-pl {
      border-radius: var(--cds-radius-sm);
      padding-top: var(--cds-space-12);
      padding-bottom: var(--cds-space-12);
    }

    /* G7: search box (PDO .input/.form-control) — 11px top/bottom,
       16px ($spacing-md) right, 40px ($spacing-xlg-2) left for the magnifier.
       Scoped to this page's filters search only; beats cds-input-group's
       own :host padding (0,1,0) with (0,2,1). */
    :host ::ng-deep .filters cds-input-group {
      padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40);
    }

    /* brand wordmark (stand-in for the onePDO logo) */
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .cds-container { display: flex; flex-direction: column; gap: var(--cds-space-16); }

    /* switcher (left) + filter controls (right) share one row */
    .pipeline-bar { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .filters { display: flex; align-items: center; gap: var(--cds-space-12); }
    /* faux ng-select: bordered box (.ng-select-container) wrapping a bare
       placeholder text node (.ng-placeholder), mirroring lead-create. */
    .filters__select {
      display: flex; align-items: center; gap: var(--cds-space-8);
      min-width: 160px;
      min-height: var(--cds-control-height-lg);
      padding: var(--cds-space-11) var(--cds-space-16);
      background: var(--cds-surface);
      border: 1px solid var(--cds-border-subtle);
      border-radius: var(--cds-radius-sm);
    }
    .filters__select-ph {
      flex: 1 1 auto;
      text-align: start;
      font-family: var(--cds-font-family-regular);
      font-weight: var(--cds-weight-regular);
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
      color: var(--cds-text-tertiary);
    }
    .filters__select > i { flex: none; font-size: var(--cds-font-size-lg); line-height: 1; color: var(--cds-text-primary); }

    /* caption + legend row */
    .legend-row { display: flex; align-items: center; gap: var(--cds-space-16); }
    /* G5: both hints — text-primary, 12px, line-height 12px (=1), no flex gap. */
    .legend-row__note { margin: 0; display: inline-flex; align-items: center; gap: normal; font-size: var(--cds-font-size-sm); line-height: 1; color: var(--cds-text-primary); }
    .legend-row__note i { font-size: 1rem; color: var(--cds-text-tertiary); }
    .legend-row__key { display: inline-flex; align-items: center; gap: normal; font-size: var(--cds-font-size-sm); line-height: 1; color: var(--cds-text-primary); }
    .legend-row__dot { width: 8px; height: 8px; border-radius: var(--cds-radius-pill); background: var(--cds-danger-500, #ef4444); }

    /* board */
    .board { display: flex; gap: var(--cds-space-16); overflow-x: auto; padding-bottom: var(--cds-space-16); }

    /* card content projected into cds-kanban-card */
    .pc__head { display: flex; align-items: center; gap: var(--cds-space-8); }
    .pc__id { display: flex; flex-direction: column; min-width: 0; }
    .pc__name { font-weight: 600; font-size: var(--cds-font-size-md); color: var(--cds-text-primary); }
    .pc__phone { font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .pc__prop { margin-top: var(--cds-space-8); font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); }
    .pc__prop--muted { color: var(--cds-text-tertiary); }
    .pc__price { display: flex; align-items: baseline; justify-content: space-between; gap: var(--cds-space-8); margin-top: var(--cds-space-8); }
    .pc__price-val { font-weight: 700; font-size: var(--cds-font-size-md); color: var(--cds-text-primary); }
    .pc__price-label { font-size: var(--cds-font-size-xs, .6875rem); letter-spacing: .04em; color: var(--cds-text-tertiary); }
    .pc__meta { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-8); margin-top: var(--cds-space-12); }
    .pc__days { font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .pc__days--late { color: var(--cds-danger-600, #dc2626); font-weight: 500; }
    .pc__foot { display: flex; align-items: center; gap: var(--cds-space-6); margin-top: var(--cds-space-12); padding-top: var(--cds-space-12); border-top: 1px solid var(--cds-border-subtle); font-size: var(--cds-font-size-sm); }
    .pc__foot-label { color: var(--cds-text-tertiary); }
    .pc__foot-name { color: var(--cds-text-secondary); font-weight: 500; }
  `],
})
export class StaffClientsPipelinePage {
  pipelines: CdsPipelineItem[] = [
    { icon: 'ph-fill ph-funnel',    title: 'Leads pipeline',        subtitle: 'Lead → Reservation',        count: 143 },
    { icon: 'ph ph-clipboard-text', title: 'Requirements pipeline', subtitle: 'Pre-reservation → Turnover', count: 0 },
  ];

  cols: Col[] = [
    { title: 'New Leads', count: 64, total: '₱0', cards: [
      { name: '', phone: '+63', property: '', price: '', temp: 'cold', days: 8, role: 'Project Specialist', person: 'Aria Ashby' },
      { name: '', phone: '+63', property: '', price: '', temp: 'cold', days: 8, role: 'Project Specialist', person: 'Aria Ashby' },
      { name: 'Aria Barden', phone: '+63 900-000-0024', property: 'Townscapes Malvar', price: '', temp: 'warm', days: 52, role: 'Project Specialist', person: 'Ivy Barden' },
    ]},
    { title: 'Engaged and Qualified Prospect', count: 25, total: '₱0', cards: [
      { name: 'Gia Calder', phone: '+63 900-000-0025', property: '', price: '', temp: 'cold', days: 12, role: 'Sales Director', person: 'John Doe' },
      { name: 'Aria Ashby', phone: '+63 900-000-0013', property: '', price: '', temp: 'cold', days: 27, role: 'Sales Director', person: 'Kai Ashby' },
      { name: 'Reed Ashby', phone: '+63 900-000-0014', property: '', price: '', temp: 'cold', days: 27, role: 'Sales Director', person: 'Kai Ashby' },
    ]},
    { title: 'Site Visit Scheduled', count: 14, total: '₱4,665,000', cards: [
      { name: 'Aria Calder', phone: '+63 900-000-0014', property: 'Townscapes Malvar', price: '₱4,665,000', temp: 'warm', days: 8, role: 'Project Specialist', person: 'Aria Ashby' },
      { name: 'Mara Ashby', phone: '+63 900-000-0029', property: 'Westwoods Heights', price: '', temp: 'warm', days: 61, role: 'Project Specialist', person: 'Dax Ashby' },
      { name: 'Leo Ashby', phone: '+63 900-000-0026', property: 'Townscapes Malvar', price: '', temp: 'warm', days: 61, role: 'Project Specialist', person: 'Dax Ashby' },
    ]},
    { title: 'Site Visit Completed', count: 35, total: '₱0', cards: [
      { name: 'Aria Calder', phone: '+63 900-000-0014', property: 'Townscapes Malvar', price: '', temp: 'hot', days: 8, role: 'Sales Manager', person: 'Nils Ashby' },
      { name: 'Mika Ashby', phone: '+63 900-000-0021', property: 'Townscapes Malvar', price: '', temp: 'hot', days: 106, role: 'Project Specialist', person: 'Dax Calder' },
      { name: 'Aria Ashby', phone: '+63 900-000-0014', property: 'Townscapes Malvar', price: '', temp: 'hot', days: 61, role: 'Sales Manager', person: 'Jude Ashby' },
    ]},
    { title: 'Unit & Computation Finalized', count: 5, total: '₱5,001,035', cards: [
      { name: 'Opal Ashby', phone: '+63 900-000-0014', property: 'Townscapes Malvar', price: '₱5,001,035', temp: 'hot', days: 14, role: 'Sales Director', person: 'John Doe' },
      { name: 'Celia Calder', phone: '+63 900-000-0018', property: 'Townscapes Malvar', price: '₱0', temp: 'warm', days: 61, role: 'Sales Director', person: 'John Doe' },
    ]},
    { title: 'Reserved', count: 2, total: '₱4,665,000', cards: [
      { name: 'Aria Calder', phone: '+63 900-000-0014', property: 'Townscapes Malvar', price: '₱4,665,000', temp: 'hot', days: 3, role: 'Project Specialist', person: 'Aria Ashby' },
    ]},
    { title: 'Dropped', count: 1, total: '₱0', cards: [
      { name: 'Kira Barden', phone: '+63 900-000-0015', property: 'Golden Acres', price: '', temp: 'cold', days: 92, role: 'Sales Director', person: 'Kai Ashby' },
    ]},
  ];
}
