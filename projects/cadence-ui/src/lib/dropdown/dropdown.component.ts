import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Dropdown menu (PDO nav dropdowns, row action menus, profile menu). The toggle
 * open/close is UI state the component manages; put your actions on the menu
 * items' (click) in the app.
 *
 *   <cds-dropdown align="end">
 *     <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">Actions</button>
 *     <button cds-menu-item icon="ph ph-pencil" (click)="edit()">Edit</button>
 *     <button cds-menu-item icon="ph ph-trash" danger (click)="remove()">Delete</button>
 *   </cds-dropdown>
 */
@Component({
  selector: 'cds-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-dropdown__trigger" (click)="toggle()"><ng-content select="[cds-dropdown-trigger]"></ng-content></div>
    @if (open) {
      <div class="cds-dropdown__menu cds-dropdown__menu--{{ align }}" role="menu" (click)="closeOnSelect && close()">
        <ng-content></ng-content>
      </div>
    }
  `,
  styleUrl: './dropdown.component.scss',
  host: { class: 'cds-dropdown' },
})
export class CdsDropdownComponent {
  @Input() align: 'start' | 'end' = 'start';
  /** Close the menu after any click inside it. */
  @Input() closeOnSelect = true;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  constructor(private host: ElementRef<HTMLElement>) {}

  toggle() { this.setOpen(!this.open); }
  close() { this.setOpen(false); }
  private setOpen(v: boolean) { if (v !== this.open) { this.open = v; this.openChange.emit(v); } }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) { if (this.open && !this.host.nativeElement.contains(e.target as Node)) this.close(); }

  @HostListener('document:keydown.escape')
  onEsc() { this.close(); }
}
