---
id: SvelteFormGroupApi
title: SvelteFormGroupApi
---

Defined in: [packages/svelte-form/src/Components.public.ts:259](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L259)

## Extends

- `FormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupError`, `TFormError`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: SvelteFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:280](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L280)

***

### Field

```ts
Field: SvelteFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:273](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L273)

***

### Subscribe

```ts
Subscribe: SvelteFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:287](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L287)
