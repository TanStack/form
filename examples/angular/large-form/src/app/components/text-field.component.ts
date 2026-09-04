import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <label [for]="field.api.name">
        <div>{{ label() }}</div>
        <input
          [id]="field.api.name"
          [name]="field.api.name"
          [value]="field.api.state.value"
          (blur)="field.api.handleBlur()"
          (input)="field.api.handleChange($any($event).target.value)"
        />
      </label>
      @for (error of field.api.state.meta.errors; track $index) {
        <div style="color: red">{{ error }}</div>
      }
    </div>
  `,
})
export class TextField {
  label = input.required<string>()
  field = injectField<string>()
}
