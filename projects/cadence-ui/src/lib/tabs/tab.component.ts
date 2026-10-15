import { Component, Input } from '@angular/core';

/** A single tab panel. Used inside <cds-tabs>. */
@Component({
  selector: 'cds-tab',
  standalone: true,
  template: `<div class="cds-tab__content" role="tabpanel" [hidden]="!active"><ng-content></ng-content></div>`,
  host: { class: 'cds-tab' },
})
export class CdsTabComponent {
  @Input() label = '';
  /** Optional Phosphor icon class for the tab header. */
  @Input() icon?: string;
  /** Optional count badge shown in the header (e.g. Calculations 2). */
  @Input() count?: number | string;
  active = false;
}
