---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends ReactFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:31](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L31)

## Type Parameters

### TFieldGroup

`TFieldGroup`
