As a form grows, keeping every field in one component can make the code harder
to navigate and maintain. You can move related fields into smaller components
while keeping one form instance, but each new component boundary needs a type
for the form or field it receives.

## Split a large form into sections

First define the form's reusable options with `formOptions`. In this example,
the same module also exports a named form type derived from those options. The
parent can add page-specific options, such as `onSubmit`, when it creates the
form, while extracted sections can import the same form type.

<!-- ::start:framework -->

# React

React's `ReactFormType` derives the form prop from the shared options. The
result keeps the field names and values available to `form.Field` in the
extracted component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/react-form'
import type { ReactFormType } from '@tanstack/react-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = ReactFormType<typeof profileFormOptions>
```

```tsx file="AddressFields.tsx"
import type { ProfileForm } from './shared-form'

interface AddressFieldsProps {
  form: ProfileForm
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <>
      <form.Field name="address.street">
        {(field) => (
          <input
            aria-label="Street"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="address.city">
        {(field) => (
          <input
            aria-label="City"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
    </>
  )
}
```

```tsx file="ProfileForm.tsx"
import { useForm } from '@tanstack/react-form'
import { AddressFields } from './AddressFields'
import { profileFormOptions } from './shared-form'

export function ProfileForm() {
  const form = useForm({
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  })

  return <AddressFields form={form} />
}
```

<!-- ::end:tabs -->

# Preact

Preact's `PreactFormType` derives the form prop from the shared options. The
result keeps the field names and values available to `form.Field` in the
extracted component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/preact-form'
import type { PreactFormType } from '@tanstack/preact-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = PreactFormType<typeof profileFormOptions>
```

```tsx file="AddressFields.tsx"
import type { ProfileForm } from './shared-form'

interface AddressFieldsProps {
  form: ProfileForm
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <>
      <form.Field name="address.street">
        {(field) => (
          <input
            aria-label="Street"
            value={field.value}
            onInput={(event) => field.handleChange(event.currentTarget.value)}
          />
        )}
      </form.Field>
      <form.Field name="address.city">
        {(field) => (
          <input
            aria-label="City"
            value={field.value}
            onInput={(event) => field.handleChange(event.currentTarget.value)}
          />
        )}
      </form.Field>
    </>
  )
}
```

```tsx file="ProfileForm.tsx"
import { useForm } from '@tanstack/preact-form'
import { AddressFields } from './AddressFields'
import { profileFormOptions } from './shared-form'

export function ProfileForm() {
  const form = useForm({
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  })

  return <AddressFields form={form} />
}
```

<!-- ::end:tabs -->

# Vue

Vue's `VueFormType` derives the form prop from the shared options. The result
keeps the field names and values available to `form.Field` in the extracted
component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/vue-form'
import type { VueFormType } from '@tanstack/vue-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = VueFormType<typeof profileFormOptions>
```

```vue file="AddressFields.vue"
<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileForm } from './shared-form'

const props = defineProps<{
  form: ProfileForm
}>()

const form = computed(() => props.form)
</script>

<template>
  <form.Field name="address.street" v-slot="{ field }">
    <input
      aria-label="Street"
      :value="field.value"
      @input="field.handleChange(($event.target as HTMLInputElement).value)"
    />
  </form.Field>
  <form.Field name="address.city" v-slot="{ field }">
    <input
      aria-label="City"
      :value="field.value"
      @input="field.handleChange(($event.target as HTMLInputElement).value)"
    />
  </form.Field>
</template>
```

```vue file="ProfileForm.vue"
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import AddressFields from './AddressFields.vue'
import { profileFormOptions } from './shared-form'

const form = useForm({
  ...profileFormOptions,
  onSubmit: ({ value }) => console.log(value),
})
</script>

<template>
  <AddressFields :form="form" />
</template>
```

<!-- ::end:tabs -->

# Angular

Angular's `AngularFormType` derives the form input from the shared options. The
result keeps the field names and values available to `TanStackField` in the
extracted component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/angular-form'
import type { AngularFormType } from '@tanstack/angular-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = AngularFormType<typeof profileFormOptions>
```

```ts file="address-fields.component.ts"
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TanStackField } from '@tanstack/angular-form'
import type { ProfileForm } from './shared-form'

@Component({
  selector: 'app-address-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <ng-container
      [tanstackField]="form()"
      name="address.street"
      #street="field"
    >
      <input
        aria-label="Street"
        [value]="street.api.value"
        (input)="street.api.handleChange($any($event).target.value)"
      />
    </ng-container>
    <ng-container [tanstackField]="form()" name="address.city" #city="field">
      <input
        aria-label="City"
        [value]="city.api.value"
        (input)="city.api.handleChange($any($event).target.value)"
      />
    </ng-container>
  `,
})
export class AddressFieldsComponent {
  form = input.required<ProfileForm>()
}
```

```ts file="profile-form.component.ts"
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { injectForm } from '@tanstack/angular-form'
import { AddressFieldsComponent } from './address-fields.component'
import { profileFormOptions } from './shared-form'

@Component({
  selector: 'app-profile-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddressFieldsComponent],
  template: `<app-address-fields [form]="form" />`,
})
export class ProfileFormComponent {
  form = injectForm({
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  })
}
```

<!-- ::end:tabs -->

# Solid

Solid's `SolidFormType` derives the form prop from the shared options. The
result keeps the field names and values available to `form.Field` in the
extracted component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/solid-form'
import type { SolidFormType } from '@tanstack/solid-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = SolidFormType<typeof profileFormOptions>
```

```tsx file="AddressFields.tsx"
import type { ProfileForm } from './shared-form'

interface AddressFieldsProps {
  form: ProfileForm
}

export function AddressFields(props: AddressFieldsProps) {
  return (
    <>
      <props.form.Field name="address.street">
        {(field) => (
          <input
            aria-label="Street"
            value={field().value}
            onInput={(event) => field().handleChange(event.currentTarget.value)}
          />
        )}
      </props.form.Field>
      <props.form.Field name="address.city">
        {(field) => (
          <input
            aria-label="City"
            value={field().value}
            onInput={(event) => field().handleChange(event.currentTarget.value)}
          />
        )}
      </props.form.Field>
    </>
  )
}
```

```tsx file="ProfileForm.tsx"
import { createForm } from '@tanstack/solid-form'
import { AddressFields } from './AddressFields'
import { profileFormOptions } from './shared-form'

export function ProfileForm() {
  const form = createForm(() => ({
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  }))

  return <AddressFields form={form} />
}
```

<!-- ::end:tabs -->

# Lit

Lit’s `LitFormType` derives a controller type from the shared options. The
result keeps the field names and values available to the controller's `field`
method in the extracted render function.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/lit-form'
import type { LitFormType } from '@tanstack/lit-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = LitFormType<typeof profileFormOptions>
```

```ts file="address-fields.ts"
import { html } from 'lit'
import type { ProfileForm } from './shared-form'

export function addressFields(form: ProfileForm) {
  return html`
    ${form.field(
      { name: 'address.street' },
      (field) => html`
        <input
          aria-label="Street"
          .value=${field.value}
          @input=${(event: InputEvent) =>
            field.handleChange((event.currentTarget as HTMLInputElement).value)}
        />
      `,
    )}
    ${form.field(
      { name: 'address.city' },
      (field) => html`
        <input
          aria-label="City"
          .value=${field.value}
          @input=${(event: InputEvent) =>
            field.handleChange((event.currentTarget as HTMLInputElement).value)}
        />
      `,
    )}
  `
}
```

```ts file="profile-form.ts"
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { addressFields } from './address-fields'
import { profileFormOptions } from './shared-form'

@customElement('profile-form')
export class ProfileForm extends LitElement {
  private form = new TanStackFormController(this, {
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  })

  render() {
    return html`${addressFields(this.form)}`
  }
}
```

<!-- ::end:tabs -->

# Svelte

Svelte's `SvelteFormType` derives the form prop from the shared options. The
result keeps the field names and values available to `form.Field` in the
extracted component.

<!-- ::start:tabs variant="files" -->

```ts file="shared-form.ts"
import { formOptions } from '@tanstack/svelte-form'
import type { SvelteFormType } from '@tanstack/svelte-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    name: '',
    address: {
      street: '',
      city: '',
    },
  },
})

export type ProfileForm = SvelteFormType<typeof profileFormOptions>
```

```svelte file="AddressFields.svelte"
<script lang="ts">
  import type { ProfileForm } from './shared-form.js'

  const { form }: { form: ProfileForm } = $props()
</script>

<form.Field name="address.street">
  {#snippet children(field)}
    <input
      aria-label="Street"
      value={field.value}
      oninput={(event) => field.handleChange(event.currentTarget.value)}
    />
  {/snippet}
</form.Field>
<form.Field name="address.city">
  {#snippet children(field)}
    <input
      aria-label="City"
      value={field.value}
      oninput={(event) => field.handleChange(event.currentTarget.value)}
    />
  {/snippet}
</form.Field>
```

```svelte file="ProfileForm.svelte"
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import AddressFields from './AddressFields.svelte'
  import { profileFormOptions } from './shared-form.js'

  const form = createForm(() => ({
    ...profileFormOptions,
    onSubmit: ({ value }) => console.log(value),
  }))
</script>

<AddressFields {form} />
```

<!-- ::end:tabs -->

<!-- ::end:framework -->

## Extract a field component by value type

After splitting the form into sections, you may still have repeated controls
for values such as strings, numbers, or dates. These controls don't need to
know the form's complete data shape or the path of a particular field. They
only need the type of the value they read and update.

`FieldWithValue<T>` describes a field by the value type a reusable component
handles. This preserves type checking when the component reads or updates the
value without tying it to a particular field path or form shape.

<!-- ::start:framework -->

# React

Type the React component's field prop as `FieldWithValue<string>`, then pass it
the field from the `form.Field` render prop.

<!-- ::start:tabs variant="files" -->

```tsx file="TextField.tsx"
import type { FieldWithValue } from '@tanstack/react-form'

interface TextFieldProps {
  field: FieldWithValue<string>
  label: string
}

export function TextField({ field, label }: TextFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </label>
  )
}
```

```tsx file="NameField.tsx"
import { TextField } from './TextField'
import type { ProfileForm } from './shared-form'

export function NameField({ form }: { form: ProfileForm }) {
  return (
    <form.Field name="name">
      {(field) => <TextField field={field} label="Name" />}
    </form.Field>
  )
}
```

<!-- ::end:tabs -->

# Preact

Type the Preact component's field prop as `FieldWithValue<string>`, then pass it
the field from the `form.Field` render prop.

<!-- ::start:tabs variant="files" -->

```tsx file="TextField.tsx"
import type { FieldWithValue } from '@tanstack/preact-form'

interface TextFieldProps {
  field: FieldWithValue<string>
  label: string
}

export function TextField({ field, label }: TextFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onInput={(event) => field.handleChange(event.currentTarget.value)}
      />
    </label>
  )
}
```

```tsx file="NameField.tsx"
import { TextField } from './TextField'
import type { ProfileForm } from './shared-form'

export function NameField({ form }: { form: ProfileForm }) {
  return (
    <form.Field name="name">
      {(field) => <TextField field={field} label="Name" />}
    </form.Field>
  )
}
```

<!-- ::end:tabs -->

# Vue

Type the Vue component's field prop as `FieldWithValue<string>`, then pass it
the field from the `form.Field` slot.

<!-- ::start:tabs variant="files" -->

```vue file="TextField.vue"
<script setup lang="ts">
import type { FieldWithValue } from '@tanstack/vue-form'

defineProps<{
  field: FieldWithValue<string>
  label: string
}>()
</script>

<template>
  <label>
    <span>{{ label }}</span>
    <input
      :name="field.name"
      :value="field.value"
      @blur="field.handleBlur"
      @input="field.handleChange(($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
```

```vue file="NameField.vue"
<script setup lang="ts">
import { computed } from 'vue'
import TextField from './TextField.vue'
import type { ProfileForm } from './shared-form'

const props = defineProps<{ form: ProfileForm }>()
const form = computed(() => props.form)
</script>

<template>
  <form.Field name="name" v-slot="{ field }">
    <TextField :field="field" label="Name" />
  </form.Field>
</template>
```

<!-- ::end:tabs -->

# Angular

Angular field components can declare their value type through
`injectField<string>()`. The `tanstack-app-field` directive provides the field
to that component, so it doesn't need a form input of its own.

<!-- ::start:tabs variant="files" -->

```ts file="text-field.component.ts"
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label>
      <span>{{ label() }}</span>
      <input
        [name]="field.api.name"
        [value]="field.api.value"
        (blur)="field.api.handleBlur()"
        (input)="field.api.handleChange($any($event).target.value)"
      />
    </label>
  `,
})
export class TextFieldComponent {
  label = input.required<string>()
  field = injectField<string>()
}
```

```ts file="name-field.component.ts"
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TanStackAppField, TanStackField } from '@tanstack/angular-form'
import { TextFieldComponent } from './text-field.component'
import type { ProfileForm } from './shared-form'

@Component({
  selector: 'app-name-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackAppField, TanStackField, TextFieldComponent],
  template: `
    <app-text-field
      tanstack-app-field
      [tanstackField]="form()"
      name="name"
      label="Name"
    />
  `,
})
export class NameFieldComponent {
  form = input.required<ProfileForm>()
}
```

<!-- ::end:tabs -->

# Solid

Solid's field render prop is an accessor, so the component accepts an
`Accessor<FieldWithValue<string>>`.

<!-- ::start:tabs variant="files" -->

```tsx file="TextField.tsx"
import type { Accessor } from 'solid-js'
import type { FieldWithValue } from '@tanstack/solid-form'

interface TextFieldProps {
  field: Accessor<FieldWithValue<string>>
  label: string
}

export function TextField(props: TextFieldProps) {
  return (
    <label>
      <span>{props.label}</span>
      <input
        name={props.field().name}
        value={props.field().value}
        onBlur={props.field().handleBlur}
        onInput={(event) =>
          props.field().handleChange(event.currentTarget.value)
        }
      />
    </label>
  )
}
```

```tsx file="NameField.tsx"
import { TextField } from './TextField'
import type { ProfileForm } from './shared-form'

export function NameField(props: { form: ProfileForm }) {
  return (
    <props.form.Field name="name">
      {(field) => <TextField field={field} label="Name" />}
    </props.form.Field>
  )
}
```

<!-- ::end:tabs -->

# Lit

Type the Lit render helper's field parameter as `FieldWithValue<string>`, then
call it from the controller's `field` render callback.

<!-- ::start:tabs variant="files" -->

```ts file="text-field.ts"
import { html } from 'lit'
import type { FieldWithValue } from '@tanstack/lit-form'

export function textField(field: FieldWithValue<string>, label: string) {
  return html`
    <label>
      <span>${label}</span>
      <input
        name=${field.name}
        .value=${field.value}
        @blur=${() => field.handleBlur()}
        @input=${(event: InputEvent) =>
          field.handleChange((event.currentTarget as HTMLInputElement).value)}
      />
    </label>
  `
}
```

```ts file="name-field.ts"
import { textField } from './text-field'
import type { ProfileForm } from './shared-form'

export function nameField(form: ProfileForm) {
  return form.field({ name: 'name' }, (field) => textField(field, 'Name'))
}
```

<!-- ::end:tabs -->

# Svelte

Type the Svelte component's field prop as `FieldWithValue<string>`, then pass it
the field from the `form.Field` snippet.

<!-- ::start:tabs variant="files" -->

```svelte file="TextField.svelte"
<script lang="ts">
  import type { FieldWithValue } from '@tanstack/svelte-form'

  interface Props {
    field: FieldWithValue<string>
    label: string
  }

  const { field, label }: Props = $props()
</script>

<label>
  <span>{label}</span>
  <input
    name={field.name}
    value={field.value}
    onblur={field.handleBlur}
    oninput={(event) => field.handleChange(event.currentTarget.value)}
  />
</label>
```

```svelte file="NameField.svelte"
<script lang="ts">
  import TextField from './TextField.svelte'
  import type { ProfileForm } from './shared-form.js'

  const { form }: { form: ProfileForm } = $props()
</script>

<form.Field name="name">
  {#snippet children(field)}
    <TextField {field} label="Name" />
  {/snippet}
</form.Field>
```

<!-- ::end:tabs -->

<!-- ::end:framework -->

## Accept any form or field

Some extracted controls behave the same regardless of the form's data. An
error display only needs field metadata, while a submit or reset button may
only need form state and methods. Giving these controls the concrete
`ProfileForm` type would couple them to details they don't use.

Use `AnyFieldApi` when a control doesn't depend on the field's value type. For
form-level controls, use the adapter's `Any*FormApi` type. These types
deliberately remove information about values and field paths, so use a concrete
type when a component reads either one.

<!-- ::start:framework -->

# React

React provides `AnyReactFormApi` for form-level components. Pass the field from
`form.Field` to `FieldErrors`, and pass the form instance to `SubmitButton`.

<!-- ::start:tabs variant="files" -->

```tsx file="FieldErrors.tsx"
import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldErrors({ field }: { field: AnyFieldApi }) {
  return (
    <small role="alert" aria-live="polite">
      {field.errors.map((error) => error.message).join(', ')}
    </small>
  )
}
```

```tsx file="SubmitButton.tsx"
import type { AnyReactFormApi } from '@tanstack/react-form'

export function SubmitButton({ form }: { form: AnyReactFormApi }) {
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </form.Subscribe>
  )
}
```

<!-- ::end:tabs -->

# Preact

Preact provides `AnyPreactFormApi` for form-level components. Pass the field
from `form.Field` to `FieldErrors`, and pass the form instance to
`SubmitButton`.

<!-- ::start:tabs variant="files" -->

```tsx file="FieldErrors.tsx"
import type { AnyFieldApi } from '@tanstack/preact-form'

export function FieldErrors({ field }: { field: AnyFieldApi }) {
  return (
    <small role="alert" aria-live="polite">
      {field.errors.map((error) => error.message).join(', ')}
    </small>
  )
}
```

```tsx file="SubmitButton.tsx"
import type { AnyPreactFormApi } from '@tanstack/preact-form'

export function SubmitButton({ form }: { form: AnyPreactFormApi }) {
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </form.Subscribe>
  )
}
```

<!-- ::end:tabs -->

# Vue

Vue provides `AnyVueFormApi` for form-level components. Pass the field from the
`form.Field` slot to `FieldErrors`, and pass the form instance to
`SubmitButton`.

<!-- ::start:tabs variant="files" -->

```vue file="FieldErrors.vue"
<script setup lang="ts">
import type { AnyFieldApi } from '@tanstack/vue-form'

defineProps<{ field: AnyFieldApi }>()
</script>

<template>
  <small role="alert" aria-live="polite">
    {{ field.errors.map((error) => error.message).join(', ') }}
  </small>
</template>
```

```vue file="SubmitButton.vue"
<script setup lang="ts">
import { computed } from 'vue'
import type { AnyVueFormApi } from '@tanstack/vue-form'

const props = defineProps<{ form: AnyVueFormApi }>()
const form = computed(() => props.form)
</script>

<template>
  <form.Subscribe
    :selector="(state) => [state.canSubmit, state.isSubmitting] as const"
    v-slot="[canSubmit, isSubmitting]"
  >
    <button type="submit" :disabled="!canSubmit || isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form.Subscribe>
</template>
```

<!-- ::end:tabs -->

# Angular

For a field control that doesn't read the value, use `injectField<unknown>()`
to receive the field and react to its metadata. Angular provides
`AnyAngularFormApi` when a separate component only needs form methods.

<!-- ::start:tabs variant="files" -->

```ts file="field-errors.component.ts"
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { injectField } from '@tanstack/angular-form'

@Component({
  selector: 'app-field-errors',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <small role="alert" aria-live="polite">
      @for (error of field.api.errors; track error) {
        {{ error.message }}
      }
    </small>
  `,
})
export class FieldErrorsComponent {
  field = injectField<unknown>()
}
```

```ts file="reset-button.component.ts"
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import type { AnyAngularFormApi } from '@tanstack/angular-form'

@Component({
  selector: 'app-reset-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" (click)="form().reset()">Reset</button>`,
})
export class ResetButtonComponent {
  form = input.required<AnyAngularFormApi>()
}
```

<!-- ::end:tabs -->

# Solid

Solid provides `AnySolidFormApi` for form-level components. Its field render
prop remains an accessor, so `FieldErrors` accepts an
`Accessor<AnyFieldApi>`.

<!-- ::start:tabs variant="files" -->

```tsx file="FieldErrors.tsx"
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'

export function FieldErrors(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <small role="alert" aria-live="polite">
      {props
        .field()
        .errors.map((error) => error.message)
        .join(', ')}
    </small>
  )
}
```

```tsx file="SubmitButton.tsx"
import type { AnySolidFormApi } from '@tanstack/solid-form'

export function SubmitButton(props: { form: AnySolidFormApi }) {
  return (
    <props.form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {(state) => (
        <button type="submit" disabled={!state()[0] || state()[1]}>
          {state()[1] ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </props.form.Subscribe>
  )
}
```

<!-- ::end:tabs -->

# Lit

Lit doesn't expose an `AnyLitFormApi` controller type. Use `AnyFieldApi` for a
field render helper, or pass the controller's core `form.api` object to a
helper typed with `AnyFormApi`.

<!-- ::start:tabs variant="files" -->

```ts file="field-errors.ts"
import { html } from 'lit'
import type { AnyFieldApi } from '@tanstack/lit-form'

export function fieldErrors(field: AnyFieldApi) {
  return html`
    <small role="alert" aria-live="polite">
      ${field.errors.map((error) => error.message).join(', ')}
    </small>
  `
}
```

```ts file="reset-button.ts"
import { html } from 'lit'
import type { AnyFormApi } from '@tanstack/lit-form'

export function resetButton(form: AnyFormApi) {
  return html`
    <button type="button" @click=${() => form.reset()}>Reset</button>
  `
}
```

<!-- ::end:tabs -->

# Svelte

Svelte provides `AnySvelteFormApi` for form-level components. Pass the field
from the `form.Field` snippet to `FieldErrors`, and pass the form instance to
`SubmitButton`.

<!-- ::start:tabs variant="files" -->

```svelte file="FieldErrors.svelte"
<script lang="ts">
  import type { AnyFieldApi } from '@tanstack/svelte-form'

  const { field }: { field: AnyFieldApi } = $props()
</script>

<small role="alert" aria-live="polite">
  {field.errors.map((error) => error.message).join(', ')}
</small>
```

```svelte file="SubmitButton.svelte"
<script lang="ts">
  import type { AnySvelteFormApi } from '@tanstack/svelte-form'

  const { form }: { form: AnySvelteFormApi } = $props()
</script>

<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting] as const}
>
  {#snippet children([canSubmit, isSubmitting])}
    <button type="submit" disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  {/snippet}
</form.Subscribe>
```

<!-- ::end:tabs -->

<!-- ::end:framework -->
