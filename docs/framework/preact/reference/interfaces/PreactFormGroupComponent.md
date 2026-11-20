---
id: PreactFormGroupComponent
title: PreactFormGroupComponent
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:328](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L328)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
PreactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:333](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L333)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

## Parameters

### props

[`PreactFormGroupProps`](PreactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`\>

## Returns

`ComponentChildren`
