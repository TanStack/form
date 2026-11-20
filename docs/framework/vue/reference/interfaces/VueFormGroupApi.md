---
id: VueFormGroupApi
title: VueFormGroupApi
---

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:342](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L342)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### ArrayField

```ts
ArrayField: VueFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:363](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L363)

***

### Field

```ts
Field: VueFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:356](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L356)

***

### Subscribe

```ts
Subscribe: VueFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:370](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L370)
