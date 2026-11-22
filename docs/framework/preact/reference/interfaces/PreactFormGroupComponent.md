---
id: PreactFormGroupComponent
title: PreactFormGroupComponent
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:330](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L330)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
PreactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators, TSubmitReturn>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:335](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L335)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TSubmitReturn

`TSubmitReturn` = `void`

## Parameters

### props

[`PreactFormGroupProps`](PreactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`, `TSubmitReturn`\>

## Returns

`ComponentChildren`
