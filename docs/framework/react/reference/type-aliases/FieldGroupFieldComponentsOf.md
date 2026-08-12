---
id: FieldGroupFieldComponentsOf
title: FieldGroupFieldComponentsOf
---

# Type Alias: FieldGroupFieldComponentsOf\<TFieldGroup\>

```ts
type FieldGroupFieldComponentsOf<TFieldGroup> = TFieldGroup extends ReactFieldGroup<any, infer TFieldComponents> ? TFieldComponents : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:106](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L106)

## Type Parameters

### TFieldGroup

`TFieldGroup`
