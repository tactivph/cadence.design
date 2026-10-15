import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Full-area loading placeholder. Faithful to PDO `pdo-loading-state`. */
@Component({
  selector: 'cds-loading-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-loading-state">
      <span class="cds-loading-state__spinner" role="status" aria-label="Loading"></span>
      <div class="cds-loading-state__text">
        <p class="cds-loading-state__title">{{ title }}</p>
        <p class="cds-loading-state__subtitle">{{ subtitle }}</p>
      </div>
    </div>
  `,
  styleUrl: './loading-state.component.scss',
})
export class CdsLoadingStateComponent {
  @Input() title = 'Loading in progress...';
  @Input() subtitle = 'Just a moment, data is being fetched.';
}
