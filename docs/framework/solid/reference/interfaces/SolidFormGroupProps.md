---
id: SolidFormGroupProps
title: SolidFormGroupProps
---

Defined in: [packages/solid-form/src/Components.public.ts:324](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L324)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TSubmitReturn

`TSubmitReturn` = `void`

## Properties

### children

```ts
children: (groupApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:343](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L343)

#### Parameters

##### groupApi

[`SolidFormGroupAccessor`](../type-aliases/SolidFormGroupAccessor.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>, `NoInfer`\<`TSubmitReturn`\>\>, `TFormError`, `TFieldComponents`\>

#### Returns

`Element`
