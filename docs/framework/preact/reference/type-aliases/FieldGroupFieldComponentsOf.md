---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends PreactFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:34](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L34)

## Type Parameters

### TFieldGroup

`TFieldGroup`
