---
id: FieldGroupForm
title: FieldGroupForm
---

# Type Alias: FieldGroupForm\<TFieldComponents, TFormData\>

```ts
type FieldGroupForm<TFieldComponents, TFormData> = FormApi<TFormData, any> & SolidTanStackFormComponents<TFormData, any, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:100](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L100)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>

### TFormData

`TFormData` = `any`
