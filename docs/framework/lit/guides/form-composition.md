---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes — helping enforce understanding our APIs — it's not ideal in production use cases.

This guide covers the patterns that work well in Lit:

- Building reusable field UI as custom elements that accept the `FieldApi` as a property.
- Splitting big forms across multiple custom elements while keeping the `form` property fully typed via `getFormType`.

## Reusable field components with `AnyFieldApi`

The most direct way to share field UI across multiple forms in Lit is to write a custom element that accepts the `FieldApi` instance as a property. The `AnyFieldApi` type from `@tanstack/lit-form` gives you a "this is some field, I don't care about the exact generics" type that's perfect for that property.

Because the field is a property of the custom element rather than something the element owns, the host needs to subscribe to the field's store so it re-renders when the field's value or metadata change. The `TanStackStoreSelector` reactive controller from [`@tanstack/lit-store`](https://tanstack.com/store/latest/docs/framework/lit/quick-start) does exactly that.

```ts
// text-field.ts
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import type { AnyFieldApi } from '@tanstack/lit-form'

@customElement('text-field')
export class TextField extends LitElement {
  @property({ attribute: false })
  field!: AnyFieldApi

  @property({ type: String })
  label = ''

  // Re-render whenever this field's store updates.
  _selector = new TanStackStoreSelector(this, () => this.field?.store)

  render() {
    return html`
      <label>
        <div>${this.label}</div>
        <input
          .value=${String(this.field.state.value ?? '')}
          @blur=${() => this.field.handleBlur()}
          @input=${(e: Event) =>
            this.field.handleChange((e.target as HTMLInputElement).value)}
        />
      </label>
      ${this.field.state.meta.isTouched && this.field.state.meta.errors.length
        ? html`<div style="color: red">
            ${this.field.state.meta.errors.join(', ')}
          </div>`
        : ''}
    `
  }
}
```

Use it inside the `field` directive's render callback by passing the `field` instance as a property:

```ts
import { LitElement, html } from 'lit'
import { TanStackFormController } from '@tanstack/lit-form'
import './text-field.js'

export class AppForm extends LitElement {
  form = new TanStackFormController(this, {
    defaultValues: { firstName: '', lastName: '' },
  })

  render() {
    return html`
      ${this.form.field(
        { name: 'firstName' },
        (field) => html`
          <text-field label="First Name" .field=${field}></text-field>
        `,
      )}
      ${this.form.field(
        { name: 'lastName' },
        (field) => html`
          <text-field label="Last Name" .field=${field}></text-field>
        `,
      )}
    `
  }
}
```

The `field` parameter inside the render callback remains fully typed against the `name` you passed, so `field.state.value` and `field.handleChange` are still type-checked at the call site. `<text-field>` itself uses `AnyFieldApi` internally because it has to accept any field shape.

> If your reusable component only ever wraps fields of a specific value type (for example, only `string` fields), you can narrow the property type with the generic `FieldApi<...>` instead of `AnyFieldApi` — but `AnyFieldApi` is the easiest option to start with and matches how the directive is exposed in render callbacks elsewhere.

> `TanStackStoreSelector` accepts an optional second argument to scope what triggers a re-render — for example, `(snapshot) => snapshot.meta.errors`. Passing nothing re-renders on any change to the field's store, which is the simplest default.

## Breaking big forms into smaller pieces

Sometimes forms get very large. To keep things manageable, you can break a form across multiple custom elements that each receive the `TanStackFormController` as a property.

The challenge is typing that property correctly. Writing the full `TanStackFormController<…>` generics by hand is verbose and error-prone, so `@tanstack/lit-form` provides a `getFormType` helper.

`getFormType` is a type-only utility — it does no work at runtime — that takes the same `FormOptions` you'd pass to `new TanStackFormController(...)` and returns a value whose **type** matches the controller that those options would produce.

```ts
// shared-form.ts
import { formOptions } from '@tanstack/lit-form'

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
```

Then derive the property type for a child custom element from those shared options. As with reusable field elements, the child element receives the controller as a property and won't re-render automatically when the form's state changes — wire it up with `TanStackStoreSelector` against `form.api.store`:

```ts
// child-form.ts
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { getFormType } from '@tanstack/lit-form'
import { peopleFormOpts } from './shared-form.js'
import './text-field.js'

const formType = getFormType(peopleFormOpts)

@customElement('child-form')
export class ChildForm extends LitElement {
  @property({ attribute: false })
  form!: typeof formType

  @property({ type: String })
  title = 'Child Form'

  // Re-render when the form's state changes.
  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  render() {
    return html`
      <p>${this.title}</p>
      ${this.form.field(
        { name: 'firstName' },
        (field) => html`
          <text-field label="First Name" .field=${field}></text-field>
        `,
      )}
    `
  }
}
```

And use it from the parent element by passing the controller as a property:

```ts
// app.ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { peopleFormOpts } from './shared-form.js'
import './child-form.js'

@customElement('app-root')
export class AppRoot extends LitElement {
  form = new TanStackFormController(this, peopleFormOpts)

  render() {
    return html`<child-form .form=${this.form} title="Testing"></child-form>`
  }
}
```

The child element gets a fully typed `form` property — including all of the `field` and `group` directives — without having to spell out the controller's generics by hand or maintain a hand-written type alias.

> `getFormType` only carries types; **never** call its return value at runtime. Use it as `typeof getFormType(opts)` (or assign to a `const` and use `typeof`) and pass the actual controller instance from the parent element via the `.form` property.

## Reusing groups of fields across multiple forms

The same pattern works for sharing a group of related fields (for example, a password + confirm-password pair) across forms. Define a small custom element that takes the `form` as a property typed with `getFormType` — keyed against just the slice of form data the group needs — and renders the relevant `form.field(...)` calls.

```ts
// password-fields.ts
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { formOptions, getFormType } from '@tanstack/lit-form'
import './text-field.js'

const passwordFormOpts = formOptions({
  defaultValues: {
    password: '',
    confirm_password: '',
  },
})

const passwordFormType = getFormType(passwordFormOpts)

@customElement('password-fields')
export class PasswordFields extends LitElement {
  @property({ attribute: false })
  form!: typeof passwordFormType

  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  render() {
    return html`
      ${this.form.field(
        { name: 'password' },
        (field) => html`
          <text-field label="Password" .field=${field}></text-field>
        `,
      )}
      ${this.form.field(
        {
          name: 'confirm_password',
          validators: {
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) =>
              value !== fieldApi.form.getFieldValue('password')
                ? 'Passwords do not match'
                : undefined,
          },
        },
        (field) => html`
          <text-field label="Confirm Password" .field=${field}></text-field>
        `,
      )}
    `
  }
}
```

The host form just needs to include the same fields in its own `defaultValues` (TypeScript will check that the `form` property assigned via `.form=${this.form}` is structurally compatible with `passwordFormType`).
