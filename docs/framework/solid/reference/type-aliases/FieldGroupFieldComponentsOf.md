---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends FieldGroupDefinition<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:100](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L100)

## Type Parameters

### TFieldGroup

`TFieldGroup`
