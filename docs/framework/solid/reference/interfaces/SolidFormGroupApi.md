---
id: SolidFormGroupApi
title: SolidFormGroupApi
---

# Interface: SolidFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:268](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L268)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: SolidFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/solid-form/src/Components.public.ts:289](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L289)

***

### Field

```ts
Field: SolidFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/solid-form/src/Components.public.ts:282](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L282)

***

### Subscribe

```ts
Subscribe: SolidFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/solid-form/src/Components.public.ts:296](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L296)
