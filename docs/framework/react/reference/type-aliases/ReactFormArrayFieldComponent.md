---
id: ReactFormArrayFieldComponent
title: ReactFormArrayFieldComponent
---

# Type Alias: ReactFormArrayFieldComponent()\<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFormArrayFieldComponent<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = {
<TFieldName, TFieldValidators>  (props): ReactNode | Promise<ReactNode>;
<TFieldName>  (props): ReactNode | Promise<ReactNode>;
};
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:356](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L356)

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

`TFieldName` *extends* `never`

#### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

### Parameters

#### props

`ReactFormArrayFieldPropsWithValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

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

`ReactFormArrayFieldPropsWithoutValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
