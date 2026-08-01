---
id: ui-libraries
title: UI Libraries
---

TanStack Form is headless. UI library integration consists of adapting a
field's value, blur callback, change callback, invalid state, and errors to the
component's prop names.

## Text inputs

Most controlled text inputs accept DOM-like props directly:

```tsx
<form.Field name="name">
  {(field) => (
    <TextInput
      name={field.name}
      label="Name"
      value={field.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
      error={field.errors.map((error) => error.message).join(', ')}
    />
  )}
</form.Field>
```

Use `value`, not `defaultValue`, so the UI component remains controlled by form
state.

## Checkboxes and switches

DOM-style checkbox components expose `event.target.checked`:

```tsx
<form.Field name="acceptedTerms">
  {(field) => (
    <Checkbox
      checked={field.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.checked)}
      aria-invalid={field.meta.isInvalid}
    />
  )}
</form.Field>
```

Some libraries call back with a boolean, a details object, or a union such as
`boolean | 'indeterminate'`. Normalize that value at the boundary:

```tsx
<Checkbox
  checked={field.value}
  onCheckedChange={(checked) => field.handleChange(checked === true)}
/>
```

## Selects, date pickers, and custom controls

The integration does not require a native event. Pass the value produced by the
component to `field.handleChange`:

```tsx
<DatePicker
  value={field.value}
  onValueChange={(nextDate) => field.handleChange(nextDate)}
  onBlur={field.handleBlur}
/>
```

Choose a serializable form value appropriate for your application, then adapt
the UI library's richer object at the component boundary if necessary.

## Reuse the adapter

If the same wiring appears throughout the application, extract a component that
accepts `FieldWithValue<T>` or register it with `createFormHook`.

The repository's `examples/react/ui-integration/shadcn` example demonstrates a
larger component system with branded fields, lazy-loaded controls, labels,
descriptions, and accessible error rendering.
