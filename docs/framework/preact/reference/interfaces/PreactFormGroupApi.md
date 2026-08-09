---
id: PreactFormGroupApi
title: PreactFormGroupApi
---

# Interface: PreactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:279](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L279)

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
ArrayField: PreactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:300](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L300)

***

### Field

```ts
Field: PreactFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:293](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L293)

***

### Subscribe

```ts
Subscribe: PreactFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:307](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L307)
