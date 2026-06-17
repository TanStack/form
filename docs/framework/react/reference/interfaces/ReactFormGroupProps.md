---
id: ReactFormGroupProps
title: ReactFormGroupProps
---

# Interface: ReactFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:431](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L431)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormValidatorMetas`, `TSubmitReturn`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children()

```ts
children: (groupApi) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:450](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L450)

#### Parameters

##### groupApi

[`ReactFormGroupApi`](ReactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupValidatorMetas`\<`TGroupValidators`\>, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

#### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
