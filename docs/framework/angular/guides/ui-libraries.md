---
id: ui-libraries
title: UI Libraries
---

TanStack Form is headless. UI library integration consists of adapting a
field's value, blur callback, change callback, invalid state, and errors to the
component's inputs and outputs.

## Text inputs

Wrap a UI component with `TanStackField` and pass its emitted value to
`field.api.handleChange`:

```html
<ng-container [tanstackField]="form" name="name" #field="field">
  <ui-text-input
    [name]="field.api.name"
    label="Name"
    [value]="field.api.value"
    [error]="field.api.errors.map(errorMessage).join(', ')"
    (blur)="field.api.handleBlur()"
    (valueChange)="field.api.handleChange($event)"
  />
</ng-container>
```

```ts
errorMessage = (error: { message: string }) => error.message
```

Pass the current `value`, not a one-time default, so the UI component remains
driven by form state.

## Checkboxes and switches

Adapt the output used by the component library:

```html
<ng-container [tanstackField]="form" name="acceptedTerms" #field="field">
  <ui-checkbox
    [checked]="field.api.value"
    [attr.aria-invalid]="field.api.meta.isInvalid"
    (blur)="field.api.handleBlur()"
    (checkedChange)="field.api.handleChange($event)"
  />
</ng-container>
```

Some libraries emit a details object or a union such as
`boolean | 'indeterminate'`. Normalize it at the boundary:

```html
<ui-checkbox
  [checked]="field.api.value"
  (checkedChange)="field.api.handleChange($event === true)"
/>
```

## Selects, date pickers, and custom controls

The integration does not require a native event. Pass the value emitted by the
component to `field.api.handleChange`:

```html
<ui-date-picker
  [value]="field.api.value"
  (valueChange)="field.api.handleChange($event)"
  (blur)="field.api.handleBlur()"
/>
```

Choose a serializable form value appropriate for your application, then adapt
the UI library's richer object at the component boundary if necessary.

## Reuse the adapter

When the same wiring appears throughout the application, create an Angular
field component that calls `injectField`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label>
      {{ label() }}
      <input
        [name]="field.api.name"
        [value]="field.api.value"
        (blur)="field.api.handleBlur()"
        (input)="field.api.handleChange($any($event).target.value)"
        [attr.aria-invalid]="field.api.meta.isInvalid"
      />
      @for (error of field.api.errors; track error) {
        <span role="alert">{{ error.message }}</span>
      }
    </label>
  `,
})
export class TextFieldComponent {
  label = input.required<string>()
  field = injectField<string>()
}
```

Apply `tanstack-app-field` alongside the field directive so the component can
inject its field API:

```html
<app-text-field
  label="Name"
  tanstack-app-field
  [tanstackField]="form"
  name="name"
/>
```

Import `TanStackAppField`, `TanStackField`, and the reusable field component in
the parent.

For the helper types used when passing a form or field to an extracted
component, see [Splitting forms](../../../splitting-forms).

The repository's `examples/angular/basic-splitting-form` and
`examples/angular/large-form` examples demonstrate this pattern with typed
child components.
