---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends SolidFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:31](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L31)

## Type Parameters

### TFieldGroup

`TFieldGroup`
