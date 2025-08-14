---
id: dynamic-validation
title: Dynamic Validation
---

In many cases, you want to change the validation rules based depending on the state of the form or other conditions. The most popular
example of this is when you want to validate a field differently based on whether the user has submitted the form for the first time or not.

We support this through our `onDynamic` validation function.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, revalidateLogic } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <!-- Your form template here -->
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    // If this is omitted, onDynamic will not be called
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => {
        if (!value.firstName) {
          return { firstName: 'A first name is required' }
        }
        return undefined
      },
    },
  })
}
```

> By default `onDynamic` is not called, so you need to pass `revalidateLogic()` to the `validationLogic` option of `injectForm`.

## Revalidation Options

`revalidateLogic` allows you to specify when validation should be run and change the validation rules dynamically based on the current submission state of the form.

It takes two arguments:

- `mode`: The mode of validation prior to the first form submission. This can be one of the following:
  - `change`: Validate on every change.
  - `blur`: Validate on blur.
  - `submit`: Validate on submit. (**default**)

- `modeAfterSubmission`: The mode of validation after the form has been submitted. This can be one of the following:
  - `change`: Validate on every change. (**default**)
  - `blur`: Validate on blur.
  - `submit`: Validate on submit.

You can, for example, use the following to revalidate on blur after the first submission:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <!-- Your form template here -->
  `,
})
export class AppComponent {
  form = injectForm({
    // ...
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'blur',
    }),
    // ...
  })
}
```

## Accessing Errors

Just as you might access errors from an `onChange` or `onBlur` validation, you can access the errors from the `onDynamic` validation function using the form's error map through `injectStore`.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, injectStore, revalidateLogic } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <p>{{ formErrorMap().onDynamic?.firstName }}</p>
  `,
})
export class AppComponent {
  form = injectForm({
    // ...
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => {
        if (!value.firstName) {
          return { firstName: 'A first name is required' }
        }
        return undefined
      },
    },
  })

  formErrorMap = injectStore(this.form, (state) => state.errorMap)
}
```

## Usage with Other Validation Logic

You can use `onDynamic` validation alongside other validation logic, such as `onChange` or `onBlur`.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, injectStore, revalidateLogic } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <div>
      <p>{{ formErrorMap().onChange?.firstName }}</p>
      <p>{{ formErrorMap().onDynamic?.lastName }}</p>
    </div>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onChange: ({ value }) => {
        if (!value.firstName) {
          return { firstName: 'A first name is required' }
        }
        return undefined
      },
      onDynamic: ({ value }) => {
        if (!value.lastName) {
          return { lastName: 'A last name is required' }
        }
        return undefined
      },
    },
  })

  formErrorMap = injectStore(this.form, (state) => state.errorMap)
}
```

### Usage with Fields

You can also use `onDynamic` validation with fields, just like you would with other validation logic.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, revalidateLogic } from '@tanstack/angular-form'
import type { FieldValidateFn } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <ng-container
        [tanstackField]="form"
        name="age"
        [validators]="{
          onDynamic: ageValidator
        }"
        #age="field"
      >
        <input
          type="number"
          [value]="age.api.state.value"
          (blur)="age.api.handleBlur()"
          (input)="age.api.handleChange($any($event).target.valueAsNumber)"
        />
        @if (age.api.state.meta.errorMap.onDynamic) {
          <p style="color: red">
            {{ age.api.state.meta.errorMap.onDynamic }}
          </p>
        }
      </ng-container>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class AppComponent {
  ageValidator: FieldValidateFn<any, any, any, any, number> = ({ value }) =>
    value > 18 ? undefined : 'Age must be greater than 18'

  form = injectForm({
    defaultValues: {
      name: '',
      age: 0,
    },
    validationLogic: revalidateLogic(),
    onSubmit({ value }) {
      alert(JSON.stringify(value))
    },
  })

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
```

### Async Validation

Async validation can also be used with `onDynamic` just like with other validation logic. You can even debounce the async validation to avoid excessive calls.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, revalidateLogic } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <!-- Your form template here -->
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      username: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamicAsyncDebounceMs: 500, // Debounce the async validation by 500ms
      onDynamicAsync: async ({ value }) => {
        if (!value.username) {
          return { username: 'Username is required' }
        }
        // Simulate an async validation
        const isValid = await validateUsername(value.username)
        return isValid ? undefined : { username: 'Username is already taken' }
      },
    },
  })
}
```

### Standard Schema Validation

You can also use standard schema validation libraries like Valibot or Zod with `onDynamic` validation. This allows you to define complex validation rules that can change dynamically based on the form state.

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, revalidateLogic } from '@tanstack/angular-form'
import { z } from 'zod'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <!-- Your form template here -->
  `,
})
export class AppComponent {
  schema = z.object({
    firstName: z.string().min(1, 'A first name is required'),
    lastName: z.string().min(1, 'A last name is required'),
  })

  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: this.schema,
    },
  })
}
```
