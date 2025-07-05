---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes - helping enforce understanding our APIs - it's not ideal in production use cases.

As a result, while basic usage of `[tanstackField]` enables the most powerful and flexible usage of TanStack Form, we provide APIs that wrap it and make your application code less verbose.

## Pre-bound Field Components

If you've ever used TanStack Form in Angular to bind more than one input, you'll have quickly realized how much goes into each input:

```angular-ts
import { Component } from '@angular/core'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <div>
      <ng-container
        [tanstackField]="form"
        name="firstName"
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
        @if (firstName.api.state.meta.isTouched) {
          @for (error of firstName.api.state.meta.errors; track $index) {
            <div style="color: red">
              {{ error }}
            </div>
          }
        }
        @if (firstName.api.state.meta.isValidating) {
          <p>Validating...</p>
        }
      </ng-container>
    </div>
    <div>
      <ng-container
        [tanstackField]="form"
        name="lastName"
        #lastName="field"
      >
        <label [for]="lastName.api.name">Last Name:</label>
        <input
          [id]="lastName.api.name"
          [name]="lastName.api.name"
          [value]="lastName.api.state.value"
          (blur)="lastName.api.handleBlur()"
          (input)="lastName.api.handleChange($any($event).target.value)"
        />
        @if (lastName.api.state.meta.isTouched) {
          @for (error of lastName.api.state.meta.errors; track $index) {
            <div style="color: red">
              {{ error }}
            </div>
          }
        }
        @if (lastName.api.state.meta.isValidating) {
          <p>Validating...</p>
        }
      </ng-container>
    </div>
  `,
})
export class AppComponent {
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
}
```

This is functionally correct, but introduces a _lot_ of repeated templating behavior over and over. Instead, let's move the error handling, label to input binding, and other repeated logic into a component:

```angular-ts
import {injectField} from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  template: `
    <label [for]="field.api.name">{{ label() }}</label>
    <input
      [id]="field.api.name"
      [name]="field.api.name"
      [value]="field.api.state.value"
      (blur)="field.api.handleBlur()"
      (input)="field.api.handleChange($any($event).target.value)"
    />
    @if (field.api.state.meta.isTouched) {
      @for (error of field.api.state.meta.errors; track $index) {
        <div style="color: red">
          {{ error }}
        </div>
      }
    }
    @if (field.api.state.meta.isValidating) {
      <p>Validating...</p>
    }
  `,
})
export class AppTextField {
  label = input.required<string>()
  // This API requires another part to it from the parent component
  field = injectField<string>()
}
```

> `injectField` accepts a single generic to define the `field.state.value` type.
>
> As a result, a numerical text field would be represented as `injectField<number>`, for example.

Now, we can use the `TanStackAppField` directive (`tanstack-app-field`) to `provide` the expected field associated with this input:

```angular-ts
import { Component } from '@angular/core'
import {
  TanStackAppField,
  TanStackField,
  injectForm,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField, TanStackAppField, AppTextField],
  template: `
    <div>
      <app-text-field
        label="First name:"
        tanstack-app-field
        [tanstackField]="form"
        name="firstName"
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
  `,
})
export class AppComponent {
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
}
```

> Here, the `tanstack-app-field` directive is taking the properties from `[tanstackField]` and `provide`ing them down to the `app-text-field` so that they can be more easily consumed as a component.
