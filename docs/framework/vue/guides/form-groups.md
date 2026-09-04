---
id: form-groups
title: Form Groups
---

When building a multi-stage form that has many stages, like so:

![Form stepper](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/stepper.png)

It's common for each step to have its own form. However, this complicates the form submission and validation process by requiring you to add complex logic.

Luckily, TanStack Form provides a way to build out sub-forms that make this kind of development trivial to implement: `<form.FormGroup>`.

## Usage

To use a form group in TanStack Form, you'll use `useForm` to create a `form` variable, then reference its `FormGroup` component like you would a `Field`:

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    step1: {
      name: '',
    },
    step2: {
      age: 0,
    },
  },
})
</script>

<template>
  <form.FormGroup name="step1" v-slot="{ group: formGroup }">
    <!-- `formGroup` here has all of the form-like methods you'd expect like `deleteField` or `insertFieldValue` -->
    <!-- ... -->
  </form.FormGroup>
</template>
```

This becomes much more useful when paired with external state to conditionally render a `FormGroup`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@tanstack/vue-form'

const step = ref(0)

const form = useForm({
  defaultValues: {
    step1: {
      name: '',
    },
    step2: {
      age: 0,
    },
  },
})

const onGroupSubmit = () => {
  step.value++
}

const onGroupSubmitInvalid = () => {
  // Or handle invalid submissions, just like a top-level form
}
</script>

<template>
  <form.FormGroup
    v-if="step === 0"
    name="step1"
    :onGroupSubmit="onGroupSubmit"
    :onGroupSubmitInvalid="onGroupSubmitInvalid"
    :onSubmitMeta="{} as SomeType"
    v-slot="{ group: formGroup }"
  >
    <form @submit.prevent.stop="formGroup.handleSubmit()">
      <!-- Use `formGroup.handleSubmit()` to submit the sub-form, but not the parent form -->
      <!-- ... -->
    </form>
  </form.FormGroup>
  <form.FormGroup
    v-if="step === 1"
    name="step2"
    :onGroupSubmit="() => form.handleSubmit()"
    v-slot="{ group: formGroup }"
  >
    <form @submit.prevent.stop="formGroup.handleSubmit()">
      <!-- Then, use `form.handleSubmit()` to submit the entire form -->
      <!-- ... -->
    </form>
  </form.FormGroup>
</template>
```

## Form Group Validation

Form groups have a distinct validation proceedure that we think makes sense for sub-forms:

- Form groups can have their own validation:

```vue
<template>
  <form.FormGroup
    name="step1"
    :validators="{ onChange: () => 'Error' }"
    v-slot="{ group: formGroup }"
  >
    <!-- formGroup.state.meta.errorMap // {onChange: "Error" | undefined} -->
    <!-- formGroup.state.meta.errors // ("Error")[] -->
  </form.FormGroup>
</template>
```

- Can set errors on sub-fields:

```vue
<template>
  <form.FormGroup
    name="step1"
    :validators="{
      onChange: ({ value, groupApi }) => ({
        group: value.name === 'error' ? 'Group error' : undefined,
        fields: {
          // Must use the name of the field relative to the FormGroup as the error key,
          // to stay consistent with how standard schema works with form groups
          name: value.name === 'error' ? 'Field error' : undefined,
        },
      }),
    }"
  />
</template>
```

- And can even accept standard schemas:

```vue
<template>
  <form.FormGroup
    name="step1"
    :validators="{
      onChange: z.object({
        name: z.string().min(2),
      }),
    }"
  />
</template>
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

If you want to use [dynamic validation (`onDynamic`)](./dynamic-validation.md) with a form group, do not rely on the `onDynamic` validator passed to `useForm`:

```ts
useForm({
  validationLogic: revalidateLogic(),
  validators: {
    // This validator will not run `onChange` when a sub-form is submitted;
    // it will only run `onChange` when the form itself is submitted.
    onDynamic: schema,
  },
})
```

Instead, pass your sub-schema for the group to the `onDynamic` validation of the `FormGroup` itself:

```vue
<template>
  <form.FormGroup name="step1" :validators="{ onDynamic: step1Schema }" />
</template>
```

It will treat `formGroup.submissionAttempts` as the way to change what validator is ran before/after submit.

## Form Group State

Just like you're able to access `formGroup.state.meta.errors`, you're also able to access the group's value using `formGroup.state.value`. Likewise, here are some valuable properties you can access in the `formGroup.state.meta`:

- `formGroup.state.meta.isFieldsValid`: `true` when the field-level validators have no errors
- `formGroup.state.meta.isGroupValid`: `true` when the group-level validators have no errors
- `formGroup.state.meta.isValid`: `true` when both the field-level and group-level validators have no errors
- `formGroup.state.meta.isSubmitting`: `true` when the group is in the process of being submitted
