---
id: SvelteFormGroupApi
title: SvelteFormGroupApi
---

# Interface: SvelteFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/svelte-form/src/Components.public.ts:266](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L266)

## Extends

- `FormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupErrorTypes`, `TFormErrorTypes`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: SvelteFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:287](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L287)

***

### Field

```ts
Field: SvelteFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:280](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L280)

***

### Subscribe

```ts
Subscribe: SvelteFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:294](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L294)
