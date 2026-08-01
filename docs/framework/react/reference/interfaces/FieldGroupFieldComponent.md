---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

# Interface: FieldGroupFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:109](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L109)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Call Signature

```ts
FieldGroupFieldComponent<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:113](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L113)

### Type Parameters

#### TFieldName

`TFieldName` *extends* `string`

### Parameters

#### props

`FieldGroupFieldPropsWithValidators`\<`TFieldData`, `TFieldName`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
FieldGroupFieldComponent<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:120](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L120)

### Type Parameters

#### TFieldName

`TFieldName` *extends* `string`

### Parameters

#### props

`FieldGroupFieldPropsWithoutValidators`\<`TFieldData`, `TFieldName`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
