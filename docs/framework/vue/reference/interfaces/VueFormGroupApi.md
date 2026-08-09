---
id: VueFormGroupApi
title: VueFormGroupApi
---

# Interface: VueFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:343](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L343)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### ArrayField

```ts
ArrayField: VueFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:364](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L364)

***

### Field

```ts
Field: VueFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:357](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L357)

***

### Subscribe

```ts
Subscribe: VueFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:371](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L371)
