---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends FieldGroupDefinition<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:112](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L112)

## Type Parameters

### TFieldGroup

`TFieldGroup`
