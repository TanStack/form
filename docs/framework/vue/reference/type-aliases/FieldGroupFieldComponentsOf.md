---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends FieldGroupDefinition<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:98](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L98)

## Type Parameters

### TFieldGroup

`TFieldGroup`
