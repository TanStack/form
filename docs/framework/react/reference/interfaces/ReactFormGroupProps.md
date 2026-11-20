---
id: ReactFormGroupProps
title: ReactFormGroupProps
---

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:303](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L303)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### children

```ts
children: (groupApi) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:320](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L320)

#### Parameters

##### groupApi

[`ReactFormGroupApi`](ReactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormError`, `TFieldComponents`\>

#### Returns

`ReactNode`
