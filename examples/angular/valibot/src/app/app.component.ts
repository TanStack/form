import { Component } from '@angular/core'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { customAsync, minLength, string, stringAsync } from 'valibot'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <div>
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
      </div>
      <div>
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
      </div>
      <button type="submit" [disabled]="!canSubmit()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
    </form>
  `,
})
export class AppComponent {
  firstNameValidator = string([
    minLength(3, 'First name must be at least 3 characters'),
  ])

  firstNameAsyncValidator = stringAsync([
    customAsync(async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return !value.includes('error')
    }, "No 'error' allowed in first name"),
  ])

  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit({ value }) {
      // Do something with form data
      console.log(value)
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: valibotValidator,
  })

  canSubmit = injectStore(this.form, (state) => state.canSubmit)
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
