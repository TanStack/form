---
id: ReactFormGroupComponent
title: ReactFormGroupComponent
---

# Interface: ReactFormGroupComponent()\<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:463](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L463)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Call Signature

```ts
ReactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:469](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L469)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `never`

#### TGroupValue

`TGroupValue` = `SimpleFieldValue`\<`TFormData`, `TGroupName`\>

#### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\> = `FormGroupValidators`\<`TGroupValue`\>

### Parameters

#### props

[`ReactFormGroupProps`](ReactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
ReactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:485](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L485)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `string`

#### TGroupValue

`TGroupValue` = `DeepValue`\<`TFormData`, `TGroupName`\>

#### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\> = `FormGroupValidators`\<`TGroupValue`\>

### Parameters

#### props

[`ReactFormGroupProps`](ReactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
