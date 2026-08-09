---
id: ReactFormGroupApi
title: ReactFormGroupApi
---

# Interface: ReactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:281](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L281)

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

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:302](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L302)

***

### Field

```ts
Field: ReactFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:295](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L295)

***

### Subscribe

```ts
Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:309](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L309)
