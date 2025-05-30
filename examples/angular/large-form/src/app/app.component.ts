import { Component, input } from '@angular/core'
import {
  TanStackField,
  TanStackFieldComponent,
  injectField,
  injectForm,
  injectStore,
} from '@tanstack/angular-form'
import type {
  FieldValidateAsyncFn,
  FieldValidateFn,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  template: `
    @let api = lastName.api();
    @if (api) {
      <label [for]="api.name">{{ label() }}</label>
      <input
        [id]="api.name"
        [name]="api.name"
        [value]="api.state.value"
        (blur)="api.handleBlur()"
        (input)="api.handleChange($any($event).target.value)"
      />
    }
  `,
})
export class AppTextField {
  label = input.required<string>()
  lastName = injectField<string>()
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField, TanStackFieldComponent, AppTextField],
  template: `
    <form (submit)="handleSubmit($event)">
      <div>
        <app-text-field
          label="First name:"
          tanstack-app-field
          [tanstackField]="form"
          name="firstName"
          [validators]="{
            onChange: firstNameValidator,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: firstNameAsyncValidator,
          }"
        />
      </div>
      <div>
        <app-text-field
          label="Last name:"
          tanstack-app-field
          [tanstackField]="form"
          name="lastName"
        />
      </div>
      <button type="submit" [disabled]="!canSubmit()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
      <button type="reset" (click)="form.reset()">Reset</button>
    </form>
  `,
})
export class AppComponent {
  firstNameValidator: FieldValidateFn<any, string, any> = ({ value }) =>
    !value
      ? 'A first name is required'
      : value.length < 3
        ? 'First name must be at least 3 characters'
        : undefined

  firstNameAsyncValidator: FieldValidateAsyncFn<any, string, any> = async ({
    value,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return value.includes('error') && 'No "error" allowed in first name'
  }

  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit({ value }) {
      // Do something with form data
      console.log(value)
    },
  })

  canSubmit = injectStore(this.form, (state) => state.canSubmit)
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
