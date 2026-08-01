---
id: ReactFormGroupComponent
title: ReactFormGroupComponent
---

# Interface: ReactFormGroupComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:686](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L686)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Call Signature

```ts
ReactFormGroupComponent<TGroupName, TGroupValidators>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:691](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L691)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `string`

#### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`DeepValue`\<`TFormData`, `TGroupName`\>\>

### Parameters

#### props

`ReactFormGroupPropsWithValidators`\<`TFormData`, `TGroupName`, `DeepValue`\<`TFormData`, `TGroupName`\>, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Call Signature

```ts
ReactFormGroupComponent<TGroupName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:706](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L706)

### Type Parameters

#### TGroupName

`TGroupName` *extends* `string`

### Parameters

#### props

`ReactFormGroupPropsWithoutValidators`\<`TFormData`, `TGroupName`, `DeepValue`\<`TFormData`, `TGroupName`\>, `TFormErrorTypes`, `TFieldComponents`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
