---
id: PreactFormGroupProps
title: PreactFormGroupProps
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:299](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L299)

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

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children

```ts
children: (groupApi) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:316](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L316)

#### Parameters

##### groupApi

[`PreactFormGroupApi`](PreactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormError`, `TFieldComponents`\>

#### Returns

`ComponentChildren`
