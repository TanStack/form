---
id: FormStandardSchemaValidatorOutputs
title: FormStandardSchemaValidatorOutputs
---

# Type Alias: FormStandardSchemaValidatorOutputs\<TFormValidatorMetas\>

```ts
type FormStandardSchemaValidatorOutputs<TFormValidatorMetas> = unknown extends TFormValidatorMetas ? unknown[] : MappedSchemaOutputs<TFormValidatorMetas>;
```

Defined in: [validation.public.ts:375](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L375)

## Type Parameters

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](FormValidatorMetas.md)
