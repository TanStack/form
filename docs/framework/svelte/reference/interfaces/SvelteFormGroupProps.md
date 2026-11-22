---
id: SvelteFormGroupProps
title: SvelteFormGroupProps
---

Defined in: [packages/svelte-form/src/Components.public.ts:291](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L291)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TSubmitReturn`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TSubmitReturn

`TSubmitReturn` = `void`

## Properties

### children

```ts
children: Snippet<[SvelteFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>, NoInfer<TSubmitReturn>>, TFormError, TFieldComponents>]>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:310](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L310)
