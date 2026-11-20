---
id: SvelteFormGroupProps
title: SvelteFormGroupProps
---

Defined in: [packages/svelte-form/src/Components.public.ts:291](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L291)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`\>, `"form"`\>

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

## Properties

### children

```ts
children: Snippet<[SvelteFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>>, TFormError, TFieldComponents>]>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:308](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L308)
