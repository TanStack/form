---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(component, fieldsPropName) => <TFormData>(props) => VueComponentInstance<Omit<TProps, TFieldsPropName | "form"> & object & FieldGroupFieldBindingsInstanceProp<TFieldGroup, TFormData, TFieldsPropName> & Record<string, any>, {
}>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:68](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L68)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`VueFieldGroup`](VueFieldGroup.md)\<`any`, `any`\>

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* `PropertyKey`

## Parameters

### component

`Component` & (`props`) => `any`

### fieldsPropName

`TFieldsPropName` & `FieldGroupFieldsPropName`\<`TProps`, `TFieldGroup`\>

## Returns

\<`TFormData`\>(`props`) => `VueComponentInstance`\<`Omit`\<`TProps`, `TFieldsPropName` \| `"form"`\> & `object` & `FieldGroupFieldBindingsInstanceProp`\<`TFieldGroup`, `TFormData`, `TFieldsPropName`\> & `Record`\<`string`, `any`\>, \{
\}\>
