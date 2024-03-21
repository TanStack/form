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
      <ng-container
        [tanstackField]="form"
        name="firstName"
        [validators]="{ onChange: required }"
        #f="field"
      >
        <label>
          <div>First name:</div>
          <input
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
        </label>
        @for (error of f.api.state.meta.errors; track $index) {
          <div style="color: red">
            {{ error }}
          </div>
        }
      </ng-container>
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
