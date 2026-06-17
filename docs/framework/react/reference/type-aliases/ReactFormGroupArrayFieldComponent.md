---
id: ReactFormGroupArrayFieldComponent
title: ReactFormGroupArrayFieldComponent
---

# Type Alias: ReactFormGroupArrayFieldComponent()\<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = {
<TFieldName, TFieldValidators>  (props): ReactNode | Promise<ReactNode>;
<TFieldName>  (props): ReactNode | Promise<ReactNode>;
};
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:556](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L556)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* `FormGroupValidatorMetas`

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

`TFieldName` *extends* `never`

#### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

### Parameters

#### props

`ReactFormArrayFieldPropsWithValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupValidatorMetas`, `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

### Type Parameters

#### TFieldName

`TFieldName` *extends* `never`

### Parameters

#### props

`ReactFormArrayFieldPropsWithoutValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TGroupValidatorMetas`, `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
