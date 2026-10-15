import {
  AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output,
  QueryList, SimpleChanges, OnChanges,
} from '@angular/core';
import { CdsTabComponent } from './tab.component';
import { CdsTabsVariant } from '../core/types';

/**
 * Tab group (PDO page tabs: Profile/Notes, Calculations/Endorsements…).
 * Presentational — projects <cds-tab>s and switches the active one. The app
 * can two-way bind [(activeIndex)].
 *
 *   <cds-tabs [(activeIndex)]="i">
 *     <cds-tab label="Profile">…</cds-tab>
 *     <cds-tab label="Notes" icon="ph ph-note">…</cds-tab>
 *   </cds-tabs>
 */
@Component({
  selector: 'cds-tabs',
  standalone: true,
  template: `
    <div class="cds-tabs__list" role="tablist">
      @for (tab of tabList; track tab; let i = $index) {
        <button type="button" role="tab" class="cds-tabs__tab"
                [class.cds-tabs__tab--active]="i === activeIndex"
                [attr.aria-selected]="i === activeIndex" (click)="select(i)">
          @if (tab.icon) { <i class="{{ tab.icon }}" aria-hidden="true"></i> }
          {{ tab.label }}
          @if (tab.count !== undefined) { <span class="cds-tabs__count">{{ tab.count }}</span> }
        </button>
      }
    </div>
    <div class="cds-tabs__panels"><ng-content></ng-content></div>
  `,
  styleUrl: './tabs.component.scss',
  host: {
    class: 'cds-tabs',
    '[class.cds-tabs--plain]': "variant === 'plain'",
  },
})
export class CdsTabsComponent implements AfterContentInit, OnChanges {
  @ContentChildren(CdsTabComponent) tabs!: QueryList<CdsTabComponent>;
  @Input() activeIndex = 0;
  /**
   * Visual chrome. `'underline'` (default) = PDO page tabs with the rounded,
   * bottom-bordered active underline. `'plain'` = PDO's minimal/segmented
   * secondary filter, rendered as bare centered text (no underline chrome).
   */
  @Input() variant: CdsTabsVariant = 'underline';
  @Output() activeIndexChange = new EventEmitter<number>();

  get tabList(): CdsTabComponent[] { return this.tabs ? this.tabs.toArray() : []; }

  ngAfterContentInit() { this.sync(); this.tabs.changes.subscribe(() => this.sync()); }
  ngOnChanges(c: SimpleChanges) { if (c['activeIndex']) this.sync(); }

  select(i: number) {
    if (i === this.activeIndex) return;
    this.activeIndex = i;
    this.activeIndexChange.emit(i);
    this.sync();
  }

  private sync() { this.tabList.forEach((t, i) => (t.active = i === this.activeIndex)); }
}
