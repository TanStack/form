---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends VueFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:94](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L94)

## Type Parameters

### TFieldGroup

`TFieldGroup`
