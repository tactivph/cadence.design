import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CdsAvatarSize } from '../core/types';

/**
 * Avatar with image + initials fallback. Presentational.
 *   <cds-avatar [src]="url" name="Hugo Calder" size="md" />
 */
@Component({
  selector: 'cds-avatar',
  standalone: true,
  template: `
    @if (src) {
      <img class="cds-avatar__img" [src]="src" [alt]="name || ''" />
    } @else {
      <span class="cds-avatar__initials">{{ initials() }}</span>
    }
  `,
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-avatar', '[class]': '"cds-avatar--" + size' },
})
export class CdsAvatarComponent {
  @Input() src?: string;
  @Input() set name(v: string) { this._name.set(v ?? ''); }
  @Input() size: CdsAvatarSize = 'md';

  private _name = signal('');
  initials = computed(() => {
    const parts = this._name().trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  });
}
