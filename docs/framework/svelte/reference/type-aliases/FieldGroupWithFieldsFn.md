---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TGroup\>

```ts
type FieldGroupWithFieldsFn<TGroup> = <TProps, TPropName>(Component, fieldsPropName) => <TFormData>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:135](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L135)

## Type Parameters

### TGroup

`TGroup` *extends* `object`

## Type Parameters

### TProps

`TProps` *extends* `object`

### TPropName

`TPropName` *extends* [`FieldGroupFieldsPropName`](FieldGroupFieldsPropName.md)\<`TProps`, `TGroup`\>

## Parameters

### Component

`Component`\<`TProps`\>

### fieldsPropName

`TPropName`

## Returns

\<`TFormData`\>(`options`) => `SvelteComponent` & `Component`\<`any`\> & [`WithoutFunction`](WithoutFunction.md)\<`Component`\>
