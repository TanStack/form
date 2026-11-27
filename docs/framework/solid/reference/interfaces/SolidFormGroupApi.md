---
id: SolidFormGroupApi
title: SolidFormGroupApi
---

Defined in: [packages/solid-form/src/Components.public.ts:264](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L264)

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
ArrayField: SolidFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/solid-form/src/Components.public.ts:285](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L285)

***

### Field

```ts
Field: SolidFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/solid-form/src/Components.public.ts:278](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L278)

***

### Subscribe

```ts
Subscribe: SolidFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/solid-form/src/Components.public.ts:292](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L292)
