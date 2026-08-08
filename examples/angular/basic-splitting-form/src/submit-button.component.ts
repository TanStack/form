import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import type { Signal } from '@angular/core'

@Component({
  selector: 'app-submit-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="submit" [disabled]="!canSubmit()() || isSubmitting()()">
      {{ isSubmitting()() ? '...' : 'Submit' }}
    </button>
  `,
})
export class SubmitButtonComponent {
  canSubmit = input.required<Signal<boolean>>()
  isSubmitting = input.required<Signal<boolean>>()
}
