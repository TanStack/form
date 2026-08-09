---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TFieldGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TFieldGroup> = { [TPropName in keyof TProps]-?: IsSame<TProps[TPropName], TFieldGroup> extends true ? TPropName : never }[keyof TProps];
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:149](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L149)

## Type Parameters

### TProps

`TProps`

### TFieldGroup

`TFieldGroup` *extends* [`FieldGroupDefinition`](FieldGroupDefinition.md)\<`any`, `any`\>
