import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CdsAvatarComponent } from '../../avatar/avatar.component';

/** Header user profile chip: avatar + name + role + caret. PDO `.user-role__profile`. */
@Component({
  selector: 'cds-user-chip',
  standalone: true,
  imports: [CdsAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cds-avatar [src]="src" [name]="name" size="md"></cds-avatar>
    <span class="cds-user-chip__labels">
      <span class="cds-user-chip__name">{{ name }}</span>
      @if (role) { <span class="cds-user-chip__role">{{ role }}</span> }
    </span>
    @if (caret) { <span class="cds-user-chip__caret" aria-hidden="true"><i class="ph-bold ph-caret-down"></i></span> }
  `,
  styleUrl: './user-chip.component.scss',
  host: { class: 'cds-user-chip' },
})
export class CdsUserChipComponent {
  @Input() name = '';
  @Input() role?: string;
  @Input() src?: string;
  @Input() caret = true;
}
