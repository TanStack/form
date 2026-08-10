---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends SolidFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:96](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L96)

## Type Parameters

### TFieldGroup

`TFieldGroup`
