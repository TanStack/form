---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:133](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L133)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Call Signature

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:137](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L137)

### Type Parameters

#### TFieldName

`TFieldName` *extends* `never`

### Parameters

#### props

`FieldGroupArrayFieldPropsWithValidators`\<`TFieldData`, `TFieldName`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:144](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L144)

### Type Parameters

#### TFieldName

`TFieldName` *extends* `never`

### Parameters

#### props

`FieldGroupArrayFieldPropsWithoutValidators`\<`TFieldData`, `TFieldName`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
