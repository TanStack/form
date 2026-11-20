---
id: VueFormGroupProps
title: VueFormGroupProps
---

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:373](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L373)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`\>, `"form"`\>

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

## Properties

### \[fieldComponentsType\]?

```ts
readonly optional [fieldComponentsType]?: TFieldComponents;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:390](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L390)
