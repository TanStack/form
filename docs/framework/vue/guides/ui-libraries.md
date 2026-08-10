---
id: ui-libraries
title: UI Libraries
---

TanStack Form is headless. UI library integration consists of adapting a
field's value, blur callback, change callback, invalid state, and errors to the
component's props and emitted events.

## Text inputs

Many Vue components use `modelValue` and emit `update:modelValue`:

```vue
<form.Field name="name" v-slot="{ field }">
  <TextInput
    :name="field.name"
    label="Name"
    :model-value="field.value"
    :error="field.errors.map((error) => error.message).join(', ')"
    @blur="field.handleBlur"
    @update:model-value="field.handleChange"
  />
</form.Field>
```

Pass the current value rather than a one-time default so the UI remains driven
by form state.

## Checkboxes and switches

Adapt the event used by the component library:

```vue
<form.Field name="acceptedTerms" v-slot="{ field }">
  <Checkbox
    :checked="field.value"
    :aria-invalid="field.meta.isInvalid"
    @blur="field.handleBlur"
    @update:checked="field.handleChange"
  />
</form.Field>
```

Some libraries emit a details object or a union such as
`boolean | 'indeterminate'`. Normalize it at the boundary:

```vue
<Checkbox
  :checked="field.value"
  @update:checked="(checked) => field.handleChange(checked === true)"
/>
```

## Selects, date pickers, and custom controls

The integration does not require a native event. Pass the value emitted by the
component to `field.handleChange`:

```vue
<DatePicker
  :model-value="field.value"
  @update:model-value="field.handleChange"
  @blur="field.handleBlur"
/>
```

Choose a serializable form value appropriate for your application, then adapt
the UI library's richer object at the component boundary if necessary.

## Reuse the adapter

If the same wiring appears throughout the application, extract a component
whose props include `FieldWithValue<T>`, then register it with `createFormHook`
when it should be available as a typed app field component.

For the helper types used when passing a form or field to an extracted
component, see [Splitting forms](../../../splitting-forms).

The repository's Vue large-form example demonstrates
`getFormHookHelpers`, `createFormHook`, injected app fields, and a reusable
field group.
