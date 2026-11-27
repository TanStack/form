---
id: SvelteFormGroupComponent
title: SvelteFormGroupComponent
---

```ts
type SvelteFormGroupComponent<TFormData, TFormError, TFieldComponents> = <TGroupName, TGroupValue, TGroupValidators, TSubmitReturn>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:327](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L327)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
