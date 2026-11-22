---
id: ReactFormGroupProps
title: ReactFormGroupProps
---

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:301](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L301)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TSubmitReturn`\>, `"form"`\>

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

### TSubmitReturn

`TSubmitReturn` = `void`

## Properties

### children

```ts
children: (groupApi) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:320](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L320)

#### Parameters

##### groupApi

[`ReactFormGroupApi`](ReactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>, `NoInfer`\<`TSubmitReturn`\>\>, `TFormError`, `TFieldComponents`\>

#### Returns

`ReactNode`
