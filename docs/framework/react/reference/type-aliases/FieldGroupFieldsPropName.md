---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TFieldGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TFieldGroup> = { [TPropName in keyof TProps]-?: IsSame<TProps[TPropName], TFieldGroup> extends true ? TPropName : never }[keyof TProps];
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:151](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L151)

## Type Parameters

### TProps

`TProps`

### TFieldGroup

`TFieldGroup` *extends* [`FieldGroupDefinition`](FieldGroupDefinition.md)\<`any`, `any`\>
