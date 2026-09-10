---
id: SvelteFormGroupProps
title: SvelteFormGroupProps
---

# Interface: SvelteFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/svelte-form/src/Components.public.ts:297](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L297)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### children

```ts
children: Snippet<[SvelteFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>>, TFormErrorTypes, TFieldComponents>]>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:314](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L314)
