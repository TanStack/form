---
id: ReactFormFieldComponent
title: ReactFormFieldComponent
---

# Type Alias: ReactFormFieldComponent()\<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFormFieldComponent<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = {
<TFieldName, TFieldValidators>  (props): ReactNode | Promise<ReactNode>;
<TFieldName>  (props): ReactNode | Promise<ReactNode>;
};
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:180](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L180)

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
<TFieldName, TFieldValidators>(props): ReactNode | Promise<ReactNode>;
```

### Type Parameters

#### TFieldName

`TFieldName` *extends* `string`

#### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

### Parameters

#### props

`ReactFormFieldPropsWithValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

### Type Parameters

#### TFieldName

`TFieldName` *extends* `string`

### Parameters

#### props

`ReactFormFieldPropsWithoutValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
