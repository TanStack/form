---
id: FieldGroupForm
title: FieldGroupForm
---

# Type Alias: FieldGroupForm\<TFieldComponents, TFormData\>

```ts
type FieldGroupForm<TFieldComponents, TFormData> = FormApi<TFormData, any, any> & ReactTanStackFormComponents<TFormData, any, any, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:117](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L117)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\> = `Record`\<`never`, `never`\>

### TFormData

`TFormData` = `any`
