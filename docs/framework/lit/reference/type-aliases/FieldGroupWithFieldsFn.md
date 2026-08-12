---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(render, fieldsPropName) => <TFormData>(props) => unknown;
```

Defined in: [with-fields.ts:138](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L138)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* `object`

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* `FieldGroupFieldsPropName`\<`TProps`, `TFieldGroup`\>

## Parameters

### render

(`props`) => `unknown`

### fieldsPropName

`TFieldsPropName`

## Returns

\<`TFormData`\>(`props`) => `unknown`
