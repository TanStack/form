---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TFieldGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TFieldGroup> = { [TPropName in keyof TProps]-?: IsSame<TProps[TPropName], TFieldGroup> extends true ? TPropName : never }[keyof TProps];
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:130](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L130)

## Type Parameters

### TProps

`TProps`

### TFieldGroup

`TFieldGroup` *extends* [`FieldGroupDefinition`](FieldGroupDefinition.md)\<`any`, `any`\>
