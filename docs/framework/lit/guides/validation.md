---
id: form-validation
title: Form and Field Validation
---

At the core of TanStack Form's functionalities is the concept of validation. TanStack Form makes validation highly customizable:

- You can control when to perform the validation (on change, on input, on blur, on submit...)
- Validation rules can be defined at the field level or at the form level
- Validation can be synchronous or asynchronous (for example, as a result of an API call)

## When is validation performed?

It's up to you! The `field()` method accepts some callbacks as validators such as `onChange` or `onBlur`. Those callbacks are passed the current value of the field, as well as the fieldAPI object, so that you can perform the validation. If you find a validation error, simply return the error message as string and it will be available in `field.state.meta.errors`.

Here is an example:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: ({ value }) =>
        value < 13 ? 'You must be 13 to make an account' : undefined,
    },
  },
  (field) => {
    return html`
      <label for=${field.name}>Age:</label>
      <input
        id=${field.name}
        name=${field.name}
        .value=${field.state.value}
        type="number"
        @input=${(e: Event) => {
          const target = e.target as HTMLInputElement
          field.handleChange(target.valueAsNumber)
        }}
      />
      ${!field.state.meta.isValid
        ? html`<em role="alert">${field.state.meta.errors.join(', ')}</em>`
        : nothing}
    `
  },
)}`
```

In the example above, the validation is done at each keystroke (`onChange`). If, instead, we wanted the validation to be done when the field is blurred, we would change the code above like so:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onBlur: ({ value }) =>
        value < 13 ? 'You must be 13 to make an account' : undefined,
    },
  },
  (field) => {
    return html`
      <label for=${field.name}>Age:</label>
      <input
        id=${field.name}
        name=${field.name}
        .value=${field.state.value}
        type="number"
        @blur=${() => field.handleBlur()}
        @input=${(e: Event) => {
          const target = e.target as HTMLInputElement
          field.handleChange(target.valueAsNumber)
        }}
      />
      ${!field.state.meta.isValid
        ? html`<em role="alert">${field.state.meta.errors.join(', ')}</em>`
        : nothing}
    `
  },
)}`
```

So you can control when the validation is done by implementing the desired callback. You can even perform different pieces of validation at different times:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: ({ value }) =>
        value < 13 ? 'You must be 13 to make an account' : undefined,
      onBlur: ({ value }) => (value < 0 ? 'Invalid value' : undefined),
    },
  },
  (field) => {
    return html`
      <label for=${field.name}>Age:</label>
      <input
        id=${field.name}
        name=${field.name}
        .value=${field.state.value}
        type="number"
        @blur=${() => field.handleBlur()}
        @input=${(e: Event) => {
          const target = e.target as HTMLInputElement
          field.handleChange(target.valueAsNumber)
        }}
      />
      ${!field.state.meta.isValid
        ? html`<em role="alert">${field.state.meta.errors.join(', ')}</em>`
        : nothing}
    `
  },
)}`
```

In the example above, we are validating different things on the same field at different times (at each keystroke and when blurring the field). Since `field.state.meta.errors` is an array, all the relevant errors at a given time are displayed. You can also use `field.state.meta.errorMap` to get errors based on _when_ the validation was done (onChange, onBlur etc...). More info about displaying errors below.

## Displaying Errors

Once you have your validation in place, you can map the errors from an array to be displayed in your UI:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: ({ value }) =>
        value < 13 ? 'You must be 13 to make an account' : undefined,
    },
  },
  (field) => {
    return html`
      <!-- ... -->
      ${!field.state.meta.isValid
        ? html`<em>${field.state.meta.errors.join(',')}</em>`
        : nothing}
    `
  },
)}`
```

Or use the `errorMap` property to access the specific error you're looking for:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: ({ value }) =>
        value < 13 ? 'You must be 13 to make an account' : undefined,
    },
  },
  (field) => {
    return html`
      <!-- ... -->
      ${field.state.meta.errorMap['onChange']
        ? html`<em>${field.state.meta.errorMap['onChange']}</em>`
        : nothing}
    `
  },
)}`
```

It's worth mentioning that our `errors` array and the `errorMap` matches the types returned by the validators. This means that:

```ts
import { html, nothing } from 'lit'

;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: ({ value }) => (value < 13 ? { isOldEnough: false } : undefined),
    },
  },
  (field) => {
    return html`
      <!-- ... -->
      <!-- errorMap.onChange is type `{isOldEnough: false} | undefined` -->
      <!-- meta.errors is type `Array<{isOldEnough: false} | undefined>` -->
      ${!field.state.meta.errorMap['onChange']?.isOldEnough
        ? html`<em>The user is not old enough</em>`
        : nothing}
    `
  },
)}`
```

## Validation at field level vs at form level

As shown above, each field accepts its own validation rules via the `onChange`, `onBlur` etc... callbacks. It is also possible to define validation rules at the form level (as opposed to field by field) by passing similar callbacks to the `TanStackFormController` constructor.

Example:

```ts
import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'

@customElement('my-form')
export class MyForm extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: {
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
    validators: {
      // Add validators to the form the same way you would add them to a field
      onChange({ value }) {
        if (value.age < 13) {
          return 'Must be 13 or older to sign'
        }
        return undefined
      },
    },
  })

  render() {
    return html`
      <div>
        <!-- ... -->
        ${this.#form.api.state.errorMap.onChange
          ? html`
              <div>
                <em
                  >There was an error on the form:
                  ${this.#form.api.state.errorMap.onChange}</em
                >
              </div>
            `
          : nothing}
        <!-- ... -->
      </div>
    `
  }
}
```

### Setting field-level errors from the form's validators

You can set errors on the fields from the form's validators. One common use case for this is validating all the fields on submit by calling a single API endpoint in the form's `onSubmitAsync` validator.

```ts
import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'

@customElement('my-form')
export class MyForm extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: {
      age: 0,
      socials: [],
      details: {
        email: '',
      },
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        // Validate the value on the server
        const hasErrors = await verifyDataOnServer(value)
        if (hasErrors) {
          return {
            form: 'Invalid data', // The `form` key is optional
            fields: {
              age: 'Must be 13 or older to sign',
              // Set errors on nested fields with the field's name
              'socials[0].url': 'The provided URL does not exist',
              'details.email': 'An email is required',
            },
          }
        }

        return null
      },
    },
  })

  render() {
    return html`
      <div>
        <form
          @submit=${(e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            this.#form.api.handleSubmit()
          }}
        >
          ${this.#form.field(
            { name: 'age' },
            (field) => html`
              <label for=${field.name}>Age:</label>
              <input
                id=${field.name}
                name=${field.name}
                .value=${field.state.value}
                type="number"
                @input=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.valueAsNumber)
                }}
              />
              ${!field.state.meta.isValid
                ? html`<em role="alert"
                    >${field.state.meta.errors.join(', ')}</em
                  >`
                : nothing}
            `,
          )}
          ${this.#form.api.state.errorMap.onSubmit
            ? html`
                <div>
                  <em
                    >There was an error on the form:
                    ${this.#form.api.state.errorMap.onSubmit}</em
                  >
                </div>
              `
            : nothing}
          <!--...-->
        </form>
      </div>
    `
  }
}
```

> Something worth mentioning is that if you have a form validation function that returns an error, that error may be overwritten by the field-specific validation.
>
> This means that:
>
> ```ts
> const form = new TanStackFormController(this, {
>   defaultValues: {
>     age: 0,
>   },
>   validators: {
>     onChange: ({ value }) => {
>       return {
>         fields: {
>           age: value.age < 12 ? 'Too young!' : undefined,
>         },
>       }
>     },
>   },
> })
>
> // ...
>
> return html`
>   ${this.#form.field(
>     {
>       name: 'age',
>       validators: {
>         onChange: ({ value }) =>
>           value % 2 === 0 ? 'Must be odd!' : undefined,
>       },
>     },
>     () => html`<!-- ... -->`,
>   )}
> `
> ```
>
> Will only show `'Must be odd!` even if the 'Too young!' error is returned by the form-level validation.

## Asynchronous Functional Validation

While we suspect most validations will be synchronous, there are many instances where a network call or some other async operation would be useful to validate against.

To do this, we have dedicated `onChangeAsync`, `onBlurAsync`, and other methods that can be used to validate against:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onChangeAsync: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return value < 13 ? 'You must be 13 to make an account' : undefined
      },
    },
  },
  (field) => {
    return html`
      <label for=${field.name}>Age:</label>
      <input
        id=${field.name}
        name=${field.name}
        .value=${field.state.value}
        type="number"
        @input=${(e: Event) => {
          const target = e.target as HTMLInputElement
          field.handleChange(target.valueAsNumber)
        }}
      />
      ${!field.state.meta.isValid
        ? html`<em role="alert">${field.state.meta.errors.join(', ')}</em>`
        : nothing}
    `
  },
)}`
```

Synchronous and Asynchronous validations can coexist. For example, it is possible to define both `onBlur` and `onBlurAsync` on the same field:

```ts
import { html, nothing } from 'lit'
;`${this.#form.field(
  {
    name: 'age',
    validators: {
      onBlur: ({ value }) =>
        value < 13 ? 'You must be at least 13' : undefined,
      onBlurAsync: async ({ value }) => {
        const currentAge = await fetchCurrentAgeOnProfile()
        return value < currentAge ? 'You can only increase the age' : undefined
      },
    },
  },
  (field) => {
    return html`
      <label for=${field.name}>Age:</label>
      <input
        id=${field.name}
        name=${field.name}
        .value=${field.state.value}
        type="number"
        @blur=${() => field.handleBlur()}
        @input=${(e: Event) => {
          const target = e.target as HTMLInputElement
          field.handleChange(target.valueAsNumber)
        }}
      />
      ${!field.state.meta.isValid
        ? html`<em role="alert">${field.state.meta.errors.join(', ')}</em>`
        : nothing}
    `
  },
)}`
```

The synchronous validation method (`onBlur`) is run first and the asynchronous method (`onBlurAsync`) is only run if the synchronous one (`onBlur`) succeeds. To change this behaviour, set the `asyncAlways` option to `true`, and the async method will be run regardless of the result of the sync method.

### Built-in Debouncing

While async calls are the way to go when validating against the database, running a network request on every keystroke is a good way to DDOS your database.

Instead, we enable an easy method for debouncing your `async` calls by adding a single property:

```ts
;`${this.#form.field(
  {
    name: 'age',
    asyncDebounceMs: 500,
    validators: {
      onChangeAsync: async ({ value }) => {
        // ...
      },
    },
  },
  (field) => {
    return html`<!-- ... -->`
  },
)}`
```

This will debounce every async call with a 500ms delay. You can even override this property on a per-validation property:

```ts
;`${this.#form.field(
  {
    name: 'age',
    asyncDebounceMs: 500,
    validators: {
      onChangeAsyncDebounceMs: 1500,
      onChangeAsync: async ({ value }) => {
        // ...
      },
      onBlurAsync: async ({ value }) => {
        // ...
      },
    },
  },
  (field) => {
    return html`<!-- ... -->`
  },
)}`
```

This will run `onChangeAsync` every 1500ms while `onBlurAsync` will run every 500ms.

## Validation through Schema Libraries

While functions provide more flexibility and customization over your validation, they can be a bit verbose. To help solve this, there are libraries that provide schema-based validation to make shorthand and type-strict validation substantially easier. You can also define a single schema for your entire form and pass it to the form level, errors will be automatically propagated to the fields.

### Standard Schema Libraries

TanStack Form natively supports all libraries following the [Standard Schema specification](https://github.com/standard-schema/standard-schema), most notably:

- [Zod](https://zod.dev/)
- [Valibot](https://valibot.dev/)
- [ArkType](https://arktype.io/)
- [Effect/Schema](https://effect.website/docs/schema/standard-schema/)

_Note:_ make sure to use the latest version of the schema libraries as older versions might not support Standard Schema yet.

> Validation will not provide you with transformed values. See [submission handling](../submission-handling.md) for more information.

To use schemas from these libraries you can pass them to the `validators` props as you would do with a custom function:

```ts
import { z } from 'zod'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'

const userSchema = z.object({
  age: z.number().gte(13, 'You must be 13 to make an account'),
})

@customElement('my-form')
export class MyForm extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: {
      age: 0,
    },
    validators: {
      onChange: userSchema,
    },
  })

  render() {
    return html`
      <div>
        ${this.#form.field({ name: 'age' }, (field) => {
          return html`<!-- ... -->`
        })}
      </div>
    `
  }
}
```

Async validations on form and field level are supported as well:

```ts
import { html } from 'lit'
import { z } from 'zod'

${this.#form.field(
  {
    name: 'age',
    validators: {
      onChange: z.number().gte(13, 'You must be 13 to make an account'),
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: z.number().refine(
        async (value) => {
          const currentAge = await fetchCurrentAgeOnProfile()
          return value >= currentAge
        },
        {
          message: 'You can only increase the age',
        },
      ),
    },
  },
  (field) => {
    return html`<!-- ... -->`
  },
)}
```

If you need even more control over your Standard Schema validation, you can combine a Standard Schema with a callback function like so:

```ts
import { html } from 'lit'
import { z } from 'zod'

${this.#form.field(
  {
    name: 'age',
    asyncDebounceMs: 500,
    validators: {
      onChangeAsync: async ({ value, fieldApi }) => {
        const errors = fieldApi.parseValueWithSchema(
          z.number().gte(13, 'You must be 13 to make an account'),
        )
        if (errors) return errors
        // continue with your validation
      },
    },
  },
  (field) => {
    return html`<!-- ... -->`
  },
)}
```

## Preventing invalid forms from being submitted

The `onChange`, `onBlur` etc... callbacks are also run when the form is submitted and the submission is blocked if the form is invalid.

The form state object has a `canSubmit` flag that is false when any field is invalid and the form has been touched (`canSubmit` is true until the form has been touched, even if some fields are "technically" invalid based on their `onChange`/`onBlur` props).

You can access this flag via `this.#form.api.state` and use the value in order to, for example, disable the submit button when the form is invalid (in practice, disabled buttons are not accessible, use `aria-disabled` instead).

```ts
class MyForm extends LitElement {
  #form = new TanStackFormController(this, {
    /* ... */
  })

  render() {
    return html`
      <!-- ... -->

      <!-- Dynamic submit button -->
      <button type="submit" ?disabled=${!this.#form.api.state.canSubmit}>
        ${this.#form.api.state.isSubmitting ? '...' : 'Submit'}
      </button>
    `
  }
}
```

To prevent the form from being submitted before any interaction, combine `canSubmit` with `isPristine` flags. A simple condition like `!canSubmit || isPristine` effectively disables submissions until the user has made changes.
