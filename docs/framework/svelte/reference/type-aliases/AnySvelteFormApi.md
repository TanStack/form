---
id: AnySvelteFormApi
title: AnySvelteFormApi
---

# Type Alias: AnySvelteFormApi

```ts
type AnySvelteFormApi = AnyFormApi & SvelteTanStackFormComponents<any, any, any> & SvelteFormSelectors<any, any>;
```

Defined in: [packages/svelte-form/src/formApiTypes.public.ts:68](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/formApiTypes.public.ts#L68)

A Svelte form API whose form data and error types are erased.

Use it for reusable Svelte components that only need core form operations,
selectors, and the `Field`, `ArrayField`, `Subscribe`, or `FormGroup`
components common to every Svelte form. Field paths and values are not
checked against a particular form shape; use `SvelteFormType` when a
component depends on one known form.

## Example

```svelte
<script lang="ts">
  const { form }: { form: AnySvelteFormApi } = $props()
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </button>
  {/snippet}
</form.Subscribe>
```
