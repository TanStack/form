import { Component } from '@angular/core'
import {
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
      <ng-template *tanstackField="form" name="firstName" let-field>
        <label>
          <div>First name:</div>
          <input
            [name]="field.name"
            [value]="field.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
        </label>
      </ng-template>
      <button>Submit</button>
    </form>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      firstName: 'Ryan',
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
