---
id: VueFormGroupApi
title: VueFormGroupApi
---

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:334](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L334)

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

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:355](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L355)

***

### Field

```ts
Field: VueFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:348](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L348)

***

### Subscribe

```ts
Subscribe: VueFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:362](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L362)
