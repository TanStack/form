---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/vue-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Options

You can create options for your form so that it can be shared between multiple forms by using the `formOptions` function.

Example:

```ts
const formOpts = formOptions<Person>({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  },
})
```

## Form Instance

A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the `useForm` function. The function accepts an object with an `onSubmit` function, which is called when the form is submitted.

```js
const form = useForm({
  ...formOpts,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
})
```

You may also create a form instance without using `formOptions` by using the standalone `useForm` API:

```ts
const form = useForm<Person>({
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  },
})
```

## Field

A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the form.Field component provided by the form instance. The component accepts a name prop, which should match a key in the form's default values. It also accepts a scoped slot defined by the `v-slot` directive which takes a `field` object as its argument.

Example:

```vue
<template>
    <!-- ... -->
    <form.Field name="fullName">
        <template v-slot="{ field }">
            <input
                :name="field.name"
                :value="field.state.value"
                @blur="field.handleBlur"
                @input="(e) => field.handleChange(e.target.value)"
            />
        </template>
    </form.Field>
    <!-- ... -->
</template>
```

## Field State

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the `field.state` property.

Example:

```js
const { value, error, touched, isValidating } = field.state
```

There are three field states can be very useful to see how the user interacts with a field. A field is _"touched"_ when the user clicks/tabs into it, _"pristine"_ until the user changes value in it, and _"dirty"_ after the value has been changed. You can check these states via the `isTouched`, `isPristine` and `isDirty` flags, as seen below.

```js
const { isTouched, isPristine, isDirty } = field.state.meta
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Field API

The Field API is an object provided by a scoped slot using the `v-slot` directive. This slot receives an argument named `field` that provides methods and properties for working with the field's state.

Example:

```vue
<template v-slot="{ field }">
    <input
        :name="field.name"
        :value="field.state.value"
        @blur="field.handleBlur"
        @input="(e) => field.handleChange(e.target.value)"
    />
</template>
```

## Validation

`@tanstack/vue-form` provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the `form.Field` component using the `validators` prop.

Example:

```vue
<template>
    <!-- ... -->
    <form.Field
        name="firstName"
        :validators="{
            onChange: ({ value }) =>
                !value
                    ? `A first name is required`
                    : value.length < 3
                        ? `First name must be at least 3 characters`
                        : undefined,
            onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return value.includes('error') && 'No "error" allowed in first name'
        },
    }"
    >
        <template v-slot="{ field }">
            <input
                :value="field.state.value"
                @input="(e) => field.handleChange(e.target.value)"
                @blur="field.handleBlur"
            />
            <FieldInfo :field="field" />
        </template>
    </form.Field>
    <!-- ... -->
</template>
```

## Validation Adapters

In addition to hand-rolled validation options, we also provide adapters like `@tanstack/zod-form-adapter`, `@tanstack/yup-form-adapter`, and `@tanstack/valibot-form-adapter` to enable usage with common schema validation tools like [Zod](https://zod.dev/), [Yup](https://github.com/jquense/yup), and [Valibot](https://valibot.dev/).

Example:

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

const form = useForm({
  // ...
  // Add a validator to support Zod usage in Form and Field
  validatorAdapter: zodValidator(),
})

const onChangeFirstName = z.string().refine(
  async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return !value.includes('error')
  },
  {
    message: "No 'error' allowed in first name",
  },
)
</script>

<template>
<!-- ... -->
    <form.Field
        name="firstName"
        :validators="{
          onChange: z
            .string()
            .min(3, 'First name must be at least 3 characters'),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: onChangeFirstName,
        }"
      >
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">First Name:</label>
          <input
            :id="field.name"
            :name="field.name"
            :value="field.state.value"
            @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
        </template>
    </form.Field>
<!-- ... -->
</template>
```

## Reactivity

`@tanstack/vue-form` offers various ways to subscribe to form and field state changes, most notably the `form.useStore` method and the `form.Subscribe` component. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example:

```vue
<script setup lang="ts">
// ...
const firstName = form.useStore((state) => state.values.firstName)
</script>

<template>
    <!-- ... -->
    <form.Subscribe>
        <template v-slot="{ canSubmit, isSubmitting }">
            <button type="submit" :disabled="!canSubmit">
            {{ isSubmitting ? '...' : 'Submit' }}
            </button>
        </template>
    </form.Subscribe>
    <!-- ... -->
</template>
```

Note: The usage of the `form.useField` method to achieve reactivity is discouraged since it is designed to be used thoughtfully within the `form.Field` component. You might want to use `form.useStore` instead.

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the `form.Field` component with the `mode="array"` prop.

When working with array fields, you can use the fields `pushValue`, `removeValue`, `swapValues` and `moveValue` methods to add, remove, and swap values in the array.

Example:

```vue
<template>
  <form @submit.prevent.stop="form.handleSubmit">
    <form.Field name="hobbies" mode="array">
      <template v-slot="{ field: hobbiesField }">
        <div>
          Hobbies
          <div>
            <div v-if="Array.isArray(hobbiesField.state.value) && !hobbiesField.state.value.length">No hobbies found.</div>
            <div v-else>
              <div v-for="(_, i) in hobbiesField.state.value" :key="i">
                <form.Field :name="`hobbies[${i}].name`">
                  <template v-slot="{ field }">
                    <div>
                      <label :for="field.name">Name:</label>
                      <input
                        :id="field.name"
                        :name="field.name"
                        :value="field.state.value"
                        @blur="field.handleBlur"
                        @input="(e) => field.handleChange(e.target.value)"
                      />
                      <button
                        type="button"
                        @click="hobbiesField.removeValue(i)"
                      >
                        X
                      </button>
                      <FieldInfo :field="field" />
                    </div>
                  </template>
                </form.Field>
                <form.Field :name="`hobbies[${i}].description`">
                  <template v-slot="{ field }">
                    <div>
                      <label :for="field.name">Description:</label>
                      <input
                        :id="field.name"
                        :name="field.name"
                        :value="field.state.value"
                        @blur="field.handleBlur"
                        @input="(e) => field.handleChange(e.target.value)"
                      />
                      <FieldInfo :field="field" />
                    </div>
                  </template>
                </form.Field>
              </div>
            </div>
            <button
              type="button"
              @click="
                hobbiesField.pushValue({
                  name: '',
                  description: '',
                  yearsOfExperience: 0,
                })
              "
            >
              Add hobby
            </button>
          </div>
        </div>
      </template>
    </form.Field>
  </form>
</template>
```

These are the basic concepts and terminology used in the `@tanstack/vue-form` library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.
