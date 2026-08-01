---
id: ReactFormGroupArrayFieldComponent
title: ReactFormGroupArrayFieldComponent
---

# Type Alias: ReactFormGroupArrayFieldComponent()\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents> = {
<TFieldName, TFieldValidators>  (props): ReactNode | Promise<ReactNode>;
<TFieldName>  (props): ReactNode | Promise<ReactNode>;
};
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:494](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L494)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

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

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

### Parameters

#### props

`ReactFormArrayFieldPropsWithValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

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

`ReactFormArrayFieldPropsWithoutValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
