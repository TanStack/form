---
id: SvelteFormGroupApi
title: SvelteFormGroupApi
---

Defined in: [packages/svelte-form/src/Components.public.ts:260](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L260)

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

Defined in: [packages/svelte-form/src/Components.public.ts:281](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L281)

***

### Field

```ts
Field: SvelteFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:274](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L274)

***

### Subscribe

```ts
Subscribe: SvelteFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:288](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L288)
