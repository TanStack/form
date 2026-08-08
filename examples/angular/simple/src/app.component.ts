import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <main>
      <h1>Simple Form Example</h1>
      <form (submit)="handleSubmit($event)">
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [validators]="firstNameValidators"
          #firstName="field"
        >
          <label [class.validating]="firstName.api.meta.isValidating">
            <span>First Name</span>
            <input
              [name]="firstName.api.name"
              [value]="firstName.api.value"
              (blur)="firstName.api.handleBlur()"
              (input)="firstName.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="firstName.api.meta.isInvalid"
            />
            @if (firstName.api.meta.isTouched && firstName.api.meta.isInvalid) {
              @for (error of firstName.api.errors; track error) {
                <small role="alert">{{ error.message }}</small>
              }
            }
          </label>
        </ng-container>

        <ng-container [tanstackField]="form" name="lastName" #lastName="field">
          <label>
            <span>Last Name</span>
            <input
              [name]="lastName.api.name"
              [value]="lastName.api.value"
              (blur)="lastName.api.handleBlur()"
              (input)="lastName.api.handleChange($any($event).target.value)"
            />
          </label>
        </ng-container>

        <div class="actions">
          <button type="submit" [disabled]="!canSubmit()">
            {{ isSubmitting() ? '...' : 'Submit' }}
          </button>
          <button type="button" (click)="form.reset()">Reset</button>
        </div>
      </form>
    </main>
  `,
})
export class AppComponent {
  firstNameValidators = [
    {
      run: ({ value }: { value: string }) =>
        !value
          ? 'A first name is required'
          : value.length < 3
            ? 'First name must be at least 3 characters'
            : undefined,
      triggers: ['change'] as const,
    },
    {
      run: async ({ value }: { value: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return value.includes('error')
          ? 'No "error" allowed in first name'
          : undefined
      },
      triggers: ['change'] as const,
      triggerDebounceMs: 500,
    },
  ]

  form = injectForm({
    defaultValues: { firstName: '', lastName: '' },
    onSubmit: async ({ value }) => console.log(value),
  })
  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
