---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TFieldGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TFieldGroup> = { [TPropName in keyof TProps]-?: IsSame<TProps[TPropName], TFieldGroup> extends true ? TPropName : never }[keyof TProps];
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:145](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L145)

## Type Parameters

### TProps

`TProps`

### TFieldGroup

`TFieldGroup` *extends* [`ReactFieldGroup`](ReactFieldGroup.md)\<`any`, `any`\>
