---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

Install the Angular adapter:

```bash
npm install @tanstack/angular-form
```

## Create a form

`injectForm` requires `defaultValues`. Their shape becomes the form's inferred
value type. Call it in an Angular injection context, such as a component field
initializer.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-profile-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <ng-container
        [tanstackField]="form"
        name="fullName"
        [validators]="fullNameValidators"
        #fullName="field"
      >
        <label>
          Full name
          <input
            [name]="fullName.api.name"
            [value]="fullName.api.value"
            (blur)="fullName.api.handleBlur()"
            (input)="fullName.api.handleChange($any($event).target.value)"
            [attr.aria-invalid]="fullName.api.meta.isInvalid"
          />
          @for (error of fullName.api.errors; track error) {
            <span role="alert">{{ error.message }}</span>
          }
        </label>
      </ng-container>

      <ng-container
        [tanstackField]="form"
        name="age"
        [validators]="ageValidators"
        #age="field"
      >
        <label>
          Age
          <input
            type="number"
            [name]="age.api.name"
            [value]="age.api.value"
            (blur)="age.api.handleBlur()"
            (input)="age.api.handleChange($any($event).target.valueAsNumber)"
            [attr.aria-invalid]="age.api.meta.isInvalid"
          />
        </label>
      </ng-container>

      <button type="submit" [disabled]="!canSubmit() || isSubmitting()">
        {{ isSubmitting() ? 'Saving…' : 'Save' }}
      </button>
    </form>
  `,
})
export class ProfileFormComponent {
  fullNameValidators = [
    {
      triggers: ['change', 'blur'] as const,
      run: ({ value }: { value: string }) =>
        value.trim() ? undefined : 'Enter your full name',
    },
  ]

  ageValidators = [
    {
      triggers: ['change'] as const,
      run: ({ value }: { value: number }) =>
        value >= 13 ? undefined : 'You must be at least 13',
    },
  ]

  form = injectForm({
    defaultValues: {
      fullName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    void this.form.handleSubmit()
  }
}
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `TanStackField` turns an element or `ng-container` with `[tanstackField]`
  into a field directive. The exported `field` reference exposes `api.value`,
  `api.meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit
  `triggers`.
- `injectSelector` creates an Angular signal for selected form state without
  making unrelated fields rerender.
- `form.handleSubmit()` validates the form before calling `onSubmit`.
