import { Component } from '@angular/core'
import {
  FieldValidateFn,
  injectForm,
  TanStackField,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <p>Testing</p>
    <form (submit)="handleSubmit($event)">
      <ng-template
        [tanstackField]="form"
        name="firstName"
        [validators]="{ onChange: required }"
        let-field
      >
        <label>
          <div>First name:</div>
          <input
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
        </label>
        @for (error of field.state.meta.errors; track $index) {
          <div style="color: red">
            {{ error }}
          </div>
        }
      </ng-template>
      <button>Submit</button>
    </form>
  `,
})
export class AppComponent {
  required: FieldValidateFn<any, string> = ({ value }) => {
    return !value ? 'Required' : undefined
  }
  form = injectForm({
    defaultValues: {
      firstName: 'Ryan',
      age: 25,
    },
    onSubmit({ value }: any) {
      console.log({ value })
    },
  })

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    void this.form.handleSubmit()
  }
}
