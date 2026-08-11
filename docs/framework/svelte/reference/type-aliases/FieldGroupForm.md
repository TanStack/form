---
id: FieldGroupForm
title: FieldGroupForm
---

# Type Alias: FieldGroupForm\<TFieldComponents, TFormData\>

```ts
type FieldGroupForm<TFieldComponents, TFormData> = FormApi<TFormData, any> & SvelteTanStackFormComponents<TFormData, any, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:102](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L102)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>

### TFormData

`TFormData` = `any`
