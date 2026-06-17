---
id: ReactFormGroupComponent
title: ReactFormGroupComponent
---

# Interface: ReactFormGroupComponent()\<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:762](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L762)

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
ReactFormGroupComponent<TGroupName, TGroupValidators>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:768](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L768)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `string`

#### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`DeepValue`\<`TFormData`, `TGroupName`\>\>

### Parameters

#### props

`ReactFormGroupPropsWithValidators`\<`TFormData`, `TGroupName`, `DeepValue`\<`TFormData`, `TGroupName`\>, `TGroupValidators`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
ReactFormGroupComponent<TGroupName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:784](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L784)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `string`

### Parameters

#### props

`ReactFormGroupPropsWithoutValidators`\<`TFormData`, `TGroupName`, `DeepValue`\<`TFormData`, `TGroupName`\>, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
