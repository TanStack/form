import { Component } from '@angular/core'
import { injectForm, TanStackField } from '@tanstack/angular-form'
import { JsonPipe, NgFor } from '@angular/common'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField, NgFor, JsonPipe],
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
          <p>{{ field | json }}</p>
          <input
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
          <div *ngFor="let error of field.state.meta.errors">{{ error }}</div>
        </label>
      </ng-template>
      <button>Submit</button>
    </form>
  `,
})
export class AppComponent {
  required = (props: any) => {
    console.log(props)
    return !props.value ? 'Required' : undefined
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
