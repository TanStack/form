---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is that it is verbose out-of-the-box. While this verbosity _can_ be useful for educational purposes - helping to enforce understanding of our APIs - it's not ideal in production use cases.

As a result, while `form.Field` enables the most powerful and flexible usage of TanStack Form, Vue also provides APIs that wrap it and make your application code less verbose.

## Custom Form Compositions

The most powerful way to compose forms in Vue is to create a reusable form composition. This allows you to create a `useAppForm` composition that is tailored to your application's needs, including pre-bound custom UI components.

At its most basic, `createFormComposition` takes provider keys for fields and forms, plus a list of field and form components, and returns:

- `useAppForm`, a typed composition for creating form instances
- `getFormType`, a type helper for strongly typing child component `form` props

> This un-customized `useAppForm` composition is identical to `useForm`, but it becomes more useful as you register app-specific components.

```ts form-providers.ts
import { createFormCompositionContexts } from '@tanstack/vue-form'

export const { fieldProviderKey, injectField, formProviderKey, injectForm } =
  createFormCompositionContexts()
```

```ts form.ts
import { createFormComposition } from '@tanstack/vue-form'
import { fieldProviderKey, formProviderKey } from './form-providers'

export const { useAppForm, getFormType } = createFormComposition({
  fieldProviderKey,
  formProviderKey,
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {},
})
```

```vue App.vue
<script setup lang="ts">
import { useAppForm } from './form'

const form = useAppForm({
  // Supports all useForm options
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
</script>

<template>
  <!-- ... -->
  <form.Field />
</template>
```

## Pre-bound Field Components

Once this scaffolding is in place, you can start adding custom field and form components to your form composition.

> Note: `injectField` must come from the same `createFormCompositionContexts` call that provided the `fieldProviderKey` passed to `createFormComposition`.

```vue TextField.vue
<script setup lang="ts">
import { useStore } from '@tanstack/vue-form'
import { injectField } from './form-providers'

const props = defineProps<{ label: string }>()

const field = injectField<string>()
</script>

<template>
  <div>
    <label>
      <div>{{ props.label }}</div>
      <input
        :value="field.state.value"
        @input="field.handleChange(($event.target as HTMLInputElement).value)"
      />
    </label>
  </div>
</template>
```

You can then register this component with your form composition.

```ts form.ts
import { createFormComposition } from '@tanstack/vue-form'
import TextField from './TextField.vue'
import { fieldProviderKey, formProviderKey } from './form-providers'

export const { useAppForm } = createFormComposition({
  fieldProviderKey,
  formProviderKey,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
```

And use it in your form:

```vue App.vue
<script setup lang="ts">
import { useAppForm } from './form'

const form = useAppForm({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
</script>

<template>
  <form.AppField name="firstName" v-slot="{ field }">
    <field.TextField label="First Name" />
  </form.AppField>
</template>
```

This not only allows you to reuse the UI of your shared component, but retains the type-safety you'd expect from TanStack Form: mistyping `firstName` will still result in a TypeScript error.

## Pre-bound Form Components

While `form.AppField` solves many of the problems with field boilerplate and reusability, it doesn't solve the problem of _form_ boilerplate and reusability.

In particular, being able to share instances of `form.Subscribe` for a reactive submit button is a common use case.

```vue SubscribeButton.vue
<script setup lang="ts">
import { injectForm } from './form-providers'

const props = defineProps<{ label: string }>()

const form = injectForm()
</script>

<template>
  <form.Subscribe :selector="(state) => state.isSubmitting" v-slot="isSubmitting">
    <button type="submit" :disabled="isSubmitting">{{ props.label }}</button>
  </form.Subscribe>
</template>
```

Register that component on the form composition:

```ts form.ts
import { createFormComposition } from '@tanstack/vue-form'
import SubscribeButton from './SubscribeButton.vue'
import TextField from './TextField.vue'
import { fieldProviderKey, formProviderKey } from './form-providers'

export const { useAppForm } = createFormComposition({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldProviderKey,
  formProviderKey,
})
```

And use it in your form:

```vue App.vue
<script setup lang="ts">
import { useAppForm } from './form'

const form = useAppForm({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
</script>

<template>
  <form.AppField name="firstName" v-slot="{ field }">
    <field.TextField label="First Name" />
  </form.AppField>

  <form.AppForm>
    <form.SubscribeButton label="Submit" />
  </form.AppForm>
</template>
```

`form.AppForm` provides the form instance for registered form components such as `form.SubscribeButton`.

## Breaking large forms into smaller pieces

Large forms are easier to maintain when you separate field components, form components, shared `formOptions`, and feature-specific templates into different files.

For typed child components, use `getFormType` to derive the expected `form` prop type from your shared options.

```ts src/compositions/form.ts
import { createFormComposition } from '@tanstack/vue-form'
import SubscribeButton from '../components/SubscribeButton.vue'
import TextField from '../components/TextField.vue'
import { fieldProviderKey, formProviderKey } from './form-providers.ts'

export const { useAppForm, getFormType } = createFormComposition({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldProviderKey,
  formProviderKey,
})
```

```vue src/features/people/AddressFields.vue
<script setup lang="ts">
import { computed } from 'vue'
import { getFormType } from '../../compositions/form.ts'
import { peopleFormOpts } from './shared-form.ts'

const formType = getFormType({ ...peopleFormOpts })
const props = defineProps<{ form: typeof formType }>()
const form = computed(() => props.form)
</script>

<template>
  <div>
    <h2>Address</h2>
    <form.AppField name="address.line1" v-slot="{ field }">
      <field.TextField label="Address Line 1" />
    </form.AppField>
    <form.AppField name="address.line2" v-slot="{ field }">
      <field.TextField label="Address Line 2" />
    </form.AppField>
    <form.AppField name="address.city" v-slot="{ field }">
      <field.TextField label="City" />
    </form.AppField>
    <form.AppField name="address.state" v-slot="{ field }">
      <field.TextField label="State" />
    </form.AppField>
    <form.AppField name="address.zip" v-slot="{ field }">
      <field.TextField label="ZIP Code" />
    </form.AppField>
  </div>
</template>
```

This gives the child component a fully typed `form` prop without having to repeat the form generics manually.

`injectForm` is still best for registered form components rendered inside `form.AppForm`. Use `getFormType` when you pass the form instance down as a prop.

## Putting it all together

Now that we've covered the basics of creating custom form compositions, here's a complete example based on the Vue field-components example.

```ts src/compositions/form-providers.ts
import { createFormCompositionContexts } from '@tanstack/vue-form'

export const { fieldProviderKey, injectField, formProviderKey, injectForm } =
  createFormCompositionContexts()
```

```ts src/compositions/form.ts
import { createFormComposition } from '@tanstack/vue-form'
import SubscribeButton from '../components/SubscribeButton.vue'
import TextField from '../components/TextField.vue'
import { fieldProviderKey, formProviderKey } from './form-providers'

export const { useAppForm, getFormType } = createFormComposition({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldProviderKey,
  formProviderKey,
})
```

```vue src/components/TextField.vue
<script setup lang="ts">
import { useStore } from '@tanstack/vue-form'
import { injectField } from '../compositions/form-providers'

const props = defineProps<{ label: string }>()

const field = injectField<string>()
const errors = useStore(field.store, (state) => state.meta.errors)
</script>

<template>
  <div>
    <label>
      <div>{{ props.label }}</div>
      <input
        :value="field.state.value"
        @input="field.handleChange(($event.target as HTMLInputElement).value)"
      />
    </label>

    <div v-for="error in errors" :key="error" style="color: red">
      {{ error }}
    </div>
  </div>
</template>
```

```vue src/components/SubscribeButton.vue
<script setup lang="ts">
import { injectForm } from '../compositions/form-providers'

const props = defineProps<{ label: string }>()

const form = injectForm()
</script>

<template>
  <form.Subscribe :selector="(state) => state.isSubmitting" v-slot="isSubmitting">
    <button type="submit" :disabled="isSubmitting">{{ props.label }}</button>
  </form.Subscribe>
</template>
```

```vue src/App.vue
<script setup lang="ts">
import { formOptions } from '@tanstack/vue-form'
import { useAppForm } from './compositions/form'

const peopleFormOpts = formOptions({
  defaultValues: {
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: {
      fullName: '',
      phone: '',
    },
  },
})

const form = useAppForm({
  ...peopleFormOpts,
  validators: {
    onChange: ({ value }) => {
      const errors = {
        fields: {},
      } as {
        fields: Record<string, string>
      }

      if (!value.fullName) {
        errors.fields.fullName = 'Full name is required'
      }

      if (!value.phone) {
        errors.fields.phone = 'Phone is required'
      }

      if (!value.emergencyContact.fullName) {
        errors.fields['emergencyContact.fullName'] =
          'Emergency contact full name is required'
      }

      if (!value.emergencyContact.phone) {
        errors.fields['emergencyContact.phone'] =
          'Emergency contact phone is required'
      }

      return errors
    },
  },
  onSubmit: ({ value }) => {
    alert(JSON.stringify(value, null, 2))
  },
})
</script>

<template>
  <form @submit.prevent.stop="form.handleSubmit()">
    <h1>Personal Information</h1>

    <form.AppField name="fullName" v-slot="{ field }">
      <field.TextField label="Full Name" />
    </form.AppField>

    <form.AppField name="email" v-slot="{ field }">
      <field.TextField label="Email" />
    </form.AppField>

    <form.AppField name="phone" v-slot="{ field }">
      <field.TextField label="Phone" />
    </form.AppField>

    <h2>Emergency Contact</h2>

    <form.AppField name="emergencyContact.fullName" v-slot="{ field }">
      <field.TextField label="Full Name" />
    </form.AppField>

    <form.AppField name="emergencyContact.phone" v-slot="{ field }">
      <field.TextField label="Phone" />
    </form.AppField>

    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </form>
</template>
```