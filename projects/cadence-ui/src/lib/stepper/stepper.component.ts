import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface CdsStep {
  label: string;
  description?: string;
  /** Override the auto state (derived from activeIndex otherwise). */
  status?: 'complete' | 'current' | 'upcoming';
}

/**
 * Stepper — horizontal (default) or vertical. Used for PDO reservation steps,
 * the lead 4-step flow, and the client requirements rail. Presentational.
 *
 *   <cds-stepper [steps]="steps" [activeIndex]="2" (stepClick)="goTo($event)" />
 */
@Component({
  selector: 'cds-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="cds-stepper cds-stepper--{{ orientation }}">
      @for (step of steps; track $index; let i = $index; let last = $last) {
        <li class="cds-stepper__step cds-stepper__step--{{ stateOf(step, i) }}"
            [class.cds-stepper__step--clickable]="clickable"
            (click)="clickable && stepClick.emit(i)">
          <span class="cds-stepper__marker">
            @if (stateOf(step, i) === 'complete') { <i class="ph ph-check" aria-hidden="true"></i> }
            @else { {{ i + 1 }} }
          </span>
          <span class="cds-stepper__text">
            <span class="cds-stepper__label">{{ step.label }}</span>
            @if (step.description) { <span class="cds-stepper__desc">{{ step.description }}</span> }
          </span>
          @if (!last) { <span class="cds-stepper__line" aria-hidden="true"></span> }
        </li>
      }
    </ol>
  `,
  styleUrl: './stepper.component.scss',
  host: { class: 'cds-stepper-host' },
})
export class CdsStepperComponent {
  @Input() steps: CdsStep[] = [];
  @Input() activeIndex = 0;
  @Input() clickable = false;
  /** Lay the steps out in a row (default) or stacked in a column. */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Output() stepClick = new EventEmitter<number>();

  stateOf(step: CdsStep, i: number): 'complete' | 'current' | 'upcoming' {
    if (step.status) return step.status;
    if (i < this.activeIndex) return 'complete';
    if (i === this.activeIndex) return 'current';
    return 'upcoming';
  }
}
