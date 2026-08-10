---
id: SolidFormGroupAccessor
title: SolidFormGroupAccessor
---

# Type Alias: SolidFormGroupAccessor\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

```ts
type SolidFormGroupAccessor<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents> = Accessor<SolidFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>> & Pick<SolidFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>, "Field" | "ArrayField" | "Subscribe">;
```

Defined in: [packages/solid-form/src/Components.public.ts:299](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L299)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
