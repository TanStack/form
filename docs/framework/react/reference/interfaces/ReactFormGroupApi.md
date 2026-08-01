---
id: ReactFormGroupApi
title: ReactFormGroupApi
---

# Interface: ReactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:533](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L533)

## Extends

- `FormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupErrorTypes`, `TFormErrorTypes`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:554](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L554)

***

### Field

```ts
Field: ReactFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:547](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L547)

***

### Subscribe

```ts
Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:561](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L561)
