---
id: form-groups
title: Form Groups
---

When building a multi-stage form that has many stages, like so:

![Form stepper](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/stepper.png)

It's common for each step to have its own form. However, this complicates the form submission and validation process by requiring you to add complex logic.

Luckily, TanStack Form provides a way to build out sub-forms that make this kind of development trivial to implement: `form.group(...)`.

## Usage

To use a form group in TanStack Form, you'll create a `TanStackFormController`, then use its `group` directive like you would use its `field` directive:

```ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'

@customElement('my-form')
export class MyForm extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: {
      step1: {
        name: '',
      },
      step2: {
        age: 0,
      },
    },
  })

  render() {
    return html`
      ${this.#form.group({ name: 'step1' }, (group) => {
        // `group` here has all of the form-like methods you'd expect like `deleteField` or `insertFieldValue`
        // ...
        return html``
      })}
    `
  }
}
```

This becomes much more useful when paired with external state to conditionally render a form group:

```ts
import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'

@customElement('my-form')
export class MyForm extends LitElement {
  @state()
  private step = 0

  #form = new TanStackFormController(this, {
    defaultValues: {
      step1: {
        name: '',
      },
      step2: {
        age: 0,
      },
    },
  })

  render() {
    return html`
      ${this.step === 0
        ? this.#form.group(
            {
              name: 'step1',
              onGroupSubmit: () => {
                // We can move the step forward when validation passes
                this.step++
              },
              onGroupSubmitInvalid: () => {
                // Or handle invalid submissions, just like a top-level form
              },
              onSubmitMeta: {} as SomeType,
            },
            (group) => html`
              <form
                @submit=${(e: Event) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Use `group.handleSubmit()` to submit the sub-form, but not the parent form
                  group.handleSubmit()
                }}
              >
                ${this.#form.field(
                  { name: 'step1.name' },
                  (field) => html`<!-- ... -->`,
                )}
              </form>
            `,
          )
        : nothing}
      ${this.step === 1
        ? this.#form.group(
            {
              name: 'step2',
              onGroupSubmit: () => {
                // Then, use `this.#form.api.handleSubmit()` to submit the entire form
                this.#form.api.handleSubmit()
              },
            },
            (group) => html`
              <form
                @submit=${(e: Event) => {
                  e.preventDefault()
                  e.stopPropagation()
                  group.handleSubmit()
                }}
              >
                ${this.#form.field(
                  { name: 'step2.age' },
                  (field) => html`<!-- ... -->`,
                )}
              </form>
            `,
          )
        : nothing}
    `
  }
}
```

When you split each step into its own custom element, pass the `TanStackFormController` as a property and type it with [`getFormType`](./form-composition.md). Because Lit child elements that receive a controller by property do not automatically re-render when the controller state changes, subscribe to `form.api.store` with `TanStackStoreSelector` in the child element.

## Form Group Validation

Form groups have a distinct validation procedure that we think makes sense for sub-forms:

- Form groups can have their own validation:

```ts
${this.#form.group(
  { name: 'step1', validators: { onChange: () => 'Error' } },
  (group) => html`
    <!-- group.state.meta.errorMap // {onChange: "Error" | undefined} -->
    <!-- group.state.meta.errors // ("Error")[] -->
  `,
)}
```

- Can set errors on sub-fields:

```ts
${this.#form.group(
  {
    name: 'step1',
    validators: {
      onChange: ({ value, groupApi }) => ({
        group: value.name === 'error' ? 'Group error' : undefined,
        fields: {
          // Must use the name of the field relative to the form group as the error key,
          // to stay consistent with how standard schema works with form groups
          name: value.name === 'error' ? 'Field error' : undefined,
        },
      }),
    },
  },
  (group) => html`<!-- ... -->`,
)}
```

- And can even accept standard schemas:

```ts
${this.#form.group(
  {
    name: 'step1',
    validators: {
      onChange: z.object({
        name: z.string().min(2),
      }),
    },
  },
  (group) => html`<!-- ... -->`,
)}
```

> The reason we don't use the full path names for fields is so that you can compose your schemas like so:
>
> ```ts
> const step1Schema = z.object({
>   name: z.string().min(2),
> })
>
> const schema = z.object({
>   step1: step1Schema,
>   step2: step2Schema,
> })
> ```
>
> And pass the `step1Schema` to a form group and `schema` to the parent form. That way, partially validated data will still flag errors if the group is bypassed.

### Dynamic Group Validation

If you want to use [dynamic validation (`onDynamic`)](./dynamic-validation.md) with a form group, do not rely on the `onDynamic` validator passed to `TanStackFormController`:

```ts
#form = new TanStackFormController(this, {
  validationLogic: revalidateLogic(),
  validators: {
    // This validator will not run `onChange` when a sub-form is submitted;
    // it will only run `onChange` when the form itself is submitted.
    onDynamic: schema,
  },
})
```

Instead, pass your sub-schema for the group to the `onDynamic` validation of the group itself:

```ts
${this.#form.group(
  { name: 'step1', validators: { onDynamic: step1Schema } },
  (group) => html`<!-- ... -->`,
)}
```

It will treat `group.submissionAttempts` as the way to change what validator is run before/after submit.

## Form Group State

Just like you're able to access `group.state.meta.errors`, you're also able to access the group's value using `group.state.value`. Likewise, here are some valuable properties you can access in the `group.state.meta`:

- `group.state.meta.isFieldsValid`: `true` when the field-level validators have no errors
- `group.state.meta.isGroupValid`: `true` when the group-level validators have no errors
- `group.state.meta.isValid`: `true` when both the field-level and group-level validators have no errors
- `group.state.meta.isSubmitting`: `true` when the group is in the process of being submitted
