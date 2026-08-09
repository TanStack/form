---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends FieldGroupDefinition<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:111](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L111)

## Type Parameters

### TFieldGroup

`TFieldGroup`
