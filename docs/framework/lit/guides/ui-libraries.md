---
id: ui-libraries
title: UI Libraries
---

TanStack Form is headless. UI library integration consists of adapting a
field's value, blur callback, change callback, invalid state, and errors to the
custom element or component's property and event names.

## Text inputs

For web components, use Lit property bindings for non-string values and event
bindings for change notifications:

```ts
this.form.field(
  { name: 'name' },
  (field) => html`
    <ui-text-input
      name=${field.name}
      label="Name"
      .value=${field.value}
      @blur=${() => field.handleBlur()}
      @input=${(event: InputEvent) =>
        field.handleChange((event.currentTarget as HTMLInputElement).value)}
      .error=${field.errors.map((error) => error.message).join(', ')}
    ></ui-text-input>
  `,
)
```

Bind the current `field.value`; do not pass a one-time default. The form remains
the source of truth.

## Checkboxes and switches

DOM-style checkbox components expose `checked` on the event target:

```ts
this.form.field(
  { name: 'acceptedTerms' },
  (field) => html`
    <ui-checkbox
      .checked=${field.value}
      @blur=${() => field.handleBlur()}
      @change=${(event: Event) =>
        field.handleChange((event.currentTarget as HTMLInputElement).checked)}
      aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
    ></ui-checkbox>
  `,
)
```

Some libraries emit a boolean, details object, or union such as
`boolean | 'indeterminate'`. Normalize the custom event at the boundary:

```ts
html`<ui-checkbox
  .checked=${field.value}
  @checked-change=${(event: CustomEvent<boolean | 'indeterminate'>) =>
    field.handleChange(event.detail === true)}
></ui-checkbox>`
```

## Selects, date pickers, and custom controls

The integration does not require a native event. Pass the value emitted by the
component to `field.handleChange`:

```ts
html`<ui-date-picker
  .value=${field.value}
  @value-change=${(event: CustomEvent<string>) =>
    field.handleChange(event.detail)}
  @blur=${() => field.handleBlur()}
></ui-date-picker>`
```

Choose a serializable form value appropriate for your application, then adapt
the UI library's richer object at the component boundary if necessary.

## Reuse the adapter

If the same wiring appears throughout the application, extract a render
function or Lit component that accepts `FieldWithValue<T>`:

```ts
import type { FieldWithValue } from '@tanstack/lit-form'

function textField(field: FieldWithValue<string>, label: string) {
  return html`
    <label>
      ${label}
      <input
        .value=${field.value}
        @input=${(event: InputEvent) =>
          field.handleChange((event.currentTarget as HTMLInputElement).value)}
      />
    </label>
  `
}
```

Use `LitFormType<typeof sharedOptions>` when a split component or render helper
needs the type of one concrete form. Use
`getFieldGroupHelpers().withFields(...)` when a reusable bundle should accept
typed virtual names that callers map to different concrete paths.

See the repository's `examples/lit/basic-splitting-form` and
`examples/lit/field-groups` examples for both patterns.
