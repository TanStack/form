---
id: AnyVueFormApi
title: AnyVueFormApi
---

# Type Alias: AnyVueFormApi

```ts
type AnyVueFormApi = AnyFormApi & VueTanStackFormComponents<any, any, any>;
```

Defined in: [packages/vue-form/src/VueForm/formApiTypes.public.ts:55](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/formApiTypes.public.ts#L55)

A Vue form API whose form data and error types are erased.

Use it for reusable Vue components that only need core form operations and
the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
every Vue form. Field paths and values are not checked against a particular
form shape; use `VueFormType` when a component depends on one known form.

## Example

```vue
<script setup lang="ts">
defineProps<{ form: AnyVueFormApi }>()
</script>

<template>
  <form.Subscribe
    :selector="(state) => state.isSubmitting"
    v-slot="isSubmitting"
  >
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : 'Save' }}
    </button>
  </form.Subscribe>
</template>
```
