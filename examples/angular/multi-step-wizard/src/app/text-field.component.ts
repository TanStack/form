import { Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  template: `
    <div>
      <label>
        <div>{{ label() }}</div>
        <input
          [value]="field.api.state.value"
          (input)="field.api.handleChange($any($event).target.value)"
          (blur)="field.api.handleBlur()"
        />
      </label>
      @for (error of field.api.state.meta.errors; track $index) {
        <div style="color: red">
          {{ error.message }}
        </div>
      }
    </div>
  `,
})
export class TextFieldComponent {
  label = input.required<string>()
  field = injectField<string>()
}
