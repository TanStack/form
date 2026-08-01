---
id: ReactFormArrayFieldComponent
title: ReactFormArrayFieldComponent
---

# Type Alias: ReactFormArrayFieldComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFormArrayFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = {
<TFieldName, TFieldValidators>  (props): ReactNode | Promise<ReactNode>;
<TFieldName>  (props): ReactNode | Promise<ReactNode>;
};
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:314](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L314)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

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

`ReactFormArrayFieldPropsWithValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

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

`ReactFormArrayFieldPropsWithoutValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
