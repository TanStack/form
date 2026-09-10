---
id: ReactFormGroupApi
title: ReactFormGroupApi
---

# Interface: ReactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:277](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L277)

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

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### ArrayField

```ts
ArrayField: ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:298](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L298)

***

### Field

```ts
Field: ReactFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:291](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L291)

***

### Subscribe

```ts
Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:305](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L305)
