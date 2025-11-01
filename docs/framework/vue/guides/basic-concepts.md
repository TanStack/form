---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/vue-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Options

You can create options for your form so that it can be shared between multiple forms by using the `formOptions` function.

Example:

```ts
const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  } as Person,
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
const form = useForm({
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  } as Person,
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

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the `field().state` property.

Example:

```ts
const {
  value,
  meta: { errors, isValidating },
} = field.state
```

There are four states in the metadata that can be useful to see how the user interacts with a field:

- _"isTouched"_, after the user changes the field or blurs the field
- _"isDirty"_, after the field's value has been changed, even if it's been reverted to the default. Opposite of `isPristine`
- _"isPristine"_, until the user changes the field value. Opposite of `isDirty`
- _"isBlurred"_, after the field has been blurred

```ts
const { isTouched, isDirty, isPristine, isBlurred } = field.state.meta
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Understanding 'isDirty' in Different Libraries

Non-Persistent `dirty` state

- **Libraries**: React Hook Form (RHF), Formik, Final Form.
- **Behavior**: A field is 'dirty' if its value differs from the default. Reverting to the default value makes it 'clean' again.

Persistent `dirty` state

- **Libraries**: Angular Form, Vue FormKit.
- **Behavior**: A field remains 'dirty' once changed, even if reverted to the default value.

We have chosen the persistent 'dirty' state model. To also support a non-persistent 'dirty' state, we introduce an additional flag:

- _"isDefaultValue"_, whether the field's current value is the default value

```ts
const { isDefaultValue, isTouched } = field.state.meta

// The following line will re-create the non-Persistent `dirty` functionality.
const nonPersistentIsDirty = !isDefaultValue
```

![Field states extended](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states-extended.png)

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

## Validation with Standard Schema Libraries

In addition to hand-rolled validation options, we also support the [Standard Schema](https://github.com/standard-schema/standard-schema) specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

- [Zod](https://zod.dev/) (v3.24.0 or higher)
- [Valibot](https://valibot.dev/) (v1.0.0 or higher)
- [ArkType](https://arktype.io/) (v2.1.20 or higher)
- [Yup](https://github.com/jquense/yup) (v1.7.0 or higher)

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { z } from 'zod'

const form = useForm({
  // ...
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
      onChange: z.string().min(3, 'First name must be at least 3 characters'),
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

## Listeners

`@tanstack/vue-form` allows you to react to specific triggers and "listen" to them to dispatch side effects.

Example:

```vue
<template>
  <form.Field
    name="country"
    :listeners="{
      onChange: ({ value }) => {
        console.log(`Country changed to: ${value}, resetting province`)
        form.setFieldValue('province', '')
      },
    }"
  >
    <template v-slot="{ field }">
      <input
        :value="field.state.value"
        @input="(e) => field.handleChange(e.target.value)"
      />
    </template>
  </form.Field>
</template>
```

More information can be found at [Listeners](../listeners.md)

Note: The usage of the `form.useField` method to achieve reactivity is discouraged since it is designed to be used thoughtfully within the `form.Field` component. You might want to use `form.useStore` instead.

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the `form.Field` component with the `mode="array"` prop.

When working with array fields, you can use the fields `pushValue`, `removeValue`, `swapValues` and `moveValue` methods to add, remove, swap, and move a value from one index to another within the array, respectively. Additional helper methods such as `insertValue`, `replaceValue`, and `clearValues` are also available for inserting, replacing, and clearing array values.

Example:

```vue
<template>
  <form @submit.prevent.stop="form.handleSubmit">
    <form.Field name="hobbies" mode="array">
      <template v-slot="{ field: hobbiesField }">
        <div>
          Hobbies
          <div>
            <div
              v-if="
                Array.isArray(hobbiesField.state.value) &&
                !hobbiesField.state.value.length
              "
            >
              No hobbies found.
            </div>
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
