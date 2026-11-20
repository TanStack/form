---
id: PreactFormGroupApi
title: PreactFormGroupApi
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:268](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L268)

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

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: PreactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:289](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L289)

***

### Field

```ts
Field: PreactFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:282](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L282)

***

### Subscribe

```ts
Subscribe: PreactFormGroupSubscribeComponent<TGroupValue, TGroupError>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:296](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L296)
