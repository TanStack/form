---
id: ServerFormStandardSchemaValidatorOutputs
title: ServerFormStandardSchemaValidatorOutputs
---

# Type Alias: ServerFormStandardSchemaValidatorOutputs\<TFormValidators\>

```ts
type ServerFormStandardSchemaValidatorOutputs<TFormValidators> = unknown extends TFormValidators ? unknown[] : FormValidators<any> extends TFormValidators ? unknown[] : MappedServerSchemaOutputs<TFormValidators>;
```

Defined in: [validation.public.ts:767](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L767)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
