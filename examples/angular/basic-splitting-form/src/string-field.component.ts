import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-string-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class.validating]="field.api.meta.isValidating">
      <span>{{ label() }}</span>
      <input
        [name]="field.api.name"
        [value]="field.api.value"
        (blur)="field.api.handleBlur()"
        (input)="field.api.handleChange($any($event).target.value)"
        [attr.aria-invalid]="field.api.meta.isInvalid"
      />
      @for (error of field.api.errors; track error) {
        <small role="alert" aria-live="polite">{{ error.message }}</small>
      }
    </label>
  `,
})
export class StringFieldComponent {
  label = input.required<string>()
  field = injectField<string>()
}
