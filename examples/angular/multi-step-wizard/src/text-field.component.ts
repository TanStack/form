import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label>
      <span>{{ label() }}</span>
      <input
        [name]="field.api.name"
        [value]="field.api.value"
        (blur)="field.api.handleBlur()"
        (input)="field.api.handleChange($any($event).target.value)"
        [attr.aria-invalid]="field.api.meta.isInvalid"
      />
      @for (error of field.api.errors; track error) {
        <small role="alert">{{ error.message }}</small>
      }
    </label>
  `,
})
export class TextFieldComponent {
  label = input.required<string>()
  field = injectField<string>()
}
