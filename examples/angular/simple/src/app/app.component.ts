import { Component } from '@angular/core'
import {
  FieldValidateAsyncFn,
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
        [validators]="{
          onChange: firstNameValidator,
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: firstNameAsyncValidator
        }"
        #firstName="field"
      >
        <label [for]="firstName.api.name">First Name:</label>
        <input
          [id]="firstName.api.name"
          [name]="firstName.api.name"
          [value]="firstName.api.state.value"
          (blur)="firstName.api.handleBlur()"
          (input)="firstName.api.handleChange($any($event).target.value)"
        />
        @for (error of firstName.api.state.meta.touchedErrors; track $index) {
          <div style="color: red">
            {{ error }}
          </div>
        }
        @if (firstName.api.state.meta.isValidating) {
          <p>Validating...</p>
        }
      </ng-container>
      <ng-container [tanstackField]="form" name="lastName" #lastName="field">
        <label [for]="lastName.api.name">Last Name:</label>
        <input
          [id]="lastName.api.name"
          [name]="lastName.api.name"
          [value]="lastName.api.state.value"
          (blur)="lastName.api.handleBlur()"
          (input)="lastName.api.handleChange($any($event).target.value)"
        />
      </ng-container>
      <button>Submit</button>
    </form>
  `,
})
export class AppComponent {
  firstNameValidator: FieldValidateFn<any, any, any, any, string> = ({
    value,
  }) =>
    !value
      ? 'A first name is required'
      : value.length < 3
        ? 'First name must be at least 3 characters'
        : undefined

  firstNameAsyncValidator: FieldValidateAsyncFn<any, any, any, any, string> =
    async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') && 'No "error" allowed in first name'
    }

  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
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
