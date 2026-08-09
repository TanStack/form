---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, component, fieldsPropName) => <TFormData>(props) => VueComponentInstance<Omit<TProps, TFieldsPropName | "form"> & object & { [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<TFieldGroup, TFormData> } & Record<string, any>, {
}>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:142](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L142)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`FieldGroupDefinition`](FieldGroupDefinition.md)\<`any`, `any`\>

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* `PropertyKey`

## Parameters

### fields

`TFieldGroup`

### component

`Component` & (`props`) => `any`

### fieldsPropName

`TFieldsPropName` & keyof `TProps`

## Returns

\<`TFormData`\>(`props`) => `VueComponentInstance`\<`Omit`\<`TProps`, `TFieldsPropName` \| `"form"`\> & `object` & `{ [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<TFieldGroup, TFormData> }` & `Record`\<`string`, `any`\>, \{
\}\>
