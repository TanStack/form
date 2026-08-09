---
id: FieldGroupForm
title: FieldGroupForm
---

# Type Alias: FieldGroupForm\<TFieldComponents, TFormData\>

```ts
type FieldGroupForm<TFieldComponents, TFormData> = FormApi<TFormData, any> & ReactTanStackFormComponents<TFormData, any, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:115](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L115)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\> = `Record`\<`never`, `never`\>

### TFormData

`TFormData` = `any`
