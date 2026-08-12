---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TGroup> = { [TName in keyof TProps]-?: IsSame<TProps[TName], TGroup> extends true ? TName : never }[keyof TProps];
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:129](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L129)

## Type Parameters

### TProps

`TProps`

### TGroup

`TGroup`
