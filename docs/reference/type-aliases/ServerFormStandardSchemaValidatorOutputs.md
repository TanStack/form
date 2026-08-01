---
id: ServerFormStandardSchemaValidatorOutputs
title: ServerFormStandardSchemaValidatorOutputs
---

# Type Alias: ServerFormStandardSchemaValidatorOutputs\<TFormValidators\>

```ts
type ServerFormStandardSchemaValidatorOutputs<TFormValidators> = unknown extends TFormValidators ? unknown[] : FormValidators<any> extends TFormValidators ? unknown[] : MappedServerSchemaOutputs<TFormValidators>;
```

Defined in: [packages/form-core/src/validation.public.ts:821](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L821)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
