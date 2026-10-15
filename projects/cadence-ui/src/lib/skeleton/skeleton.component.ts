import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Loading placeholder (PDO skeleton rows). Presentational. */
@Component({
  selector: 'cds-skeleton',
  standalone: true,
  template: '',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cds-skeleton',
    '[class.cds-skeleton--circle]': 'variant === "circle"',
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.borderRadius]': 'radius',
    'aria-hidden': 'true',
  },
})
export class CdsSkeletonComponent {
  @Input() variant: 'line' | 'block' | 'circle' = 'line';
  @Input() width = '100%';
  @Input() height = '1em';
  @Input() radius?: string;
}
