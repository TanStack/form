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
      <h1>Basic Form Example</h1>
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
            @for (error of firstName.api.errors; track error) {
              <small role="alert" aria-live="polite">{{ error.message }}</small>
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
              [attr.aria-invalid]="lastName.api.meta.isInvalid"
            />
            @for (error of lastName.api.errors; track error) {
              <small role="alert" aria-live="polite">{{ error.message }}</small>
            }
          </label>
        </ng-container>

        <div class="actions">
          <button type="submit" [disabled]="!canSubmit() || isSubmitting()">
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
      run: ({ value }: { value: string }) => {
        if (value.length === 0) return 'A first name is required'
        if (value.length < 3) return 'First name is too short'
        return undefined
      },
      triggers: ['change', 'blur'] as const,
      triggerDebounceMs: 300,
    },
    {
      run: async ({ value }: { value: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return value.toLowerCase().includes('error')
          ? 'No "error" allowed in first name'
          : undefined
      },
      triggers: ['change'] as const,
      bailIfInvalid: true,
    },
  ]

  form = injectForm({
    defaultValues: { firstName: '', lastName: '' },
    onSubmit: ({ value, createValidationError }) => {
      console.log(value)
      return createValidationError({
        fields: {
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    },
  })
  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
