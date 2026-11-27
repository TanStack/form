---
id: VueFormGroupProps
title: VueFormGroupProps
---

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:365](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L365)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TSubmitReturn`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

### TSubmitReturn

`TSubmitReturn` = `void`

## Properties

### \[fieldComponentsType\]?

```ts
readonly optional [fieldComponentsType]?: TFieldComponents;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:384](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L384)
