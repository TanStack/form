---
id: FieldGroupForm
title: FieldGroupForm
---

# Type Alias: FieldGroupForm\<TFieldComponents, TFormData\>

```ts
type FieldGroupForm<TFieldComponents, TFormData> = FormApi<TFormData, any> & PreactTanStackFormComponents<TFormData, any, TFieldComponents>;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:39](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L39)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\> = `Record`\<`never`, `never`\>

### TFormData

`TFormData` = `any`
