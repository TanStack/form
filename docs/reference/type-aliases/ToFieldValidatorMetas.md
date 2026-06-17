---
id: ToFieldValidatorMetas
title: ToFieldValidatorMetas
---

# Type Alias: ToFieldValidatorMetas\<TFieldValidators\>

```ts
type ToFieldValidatorMetas<TFieldValidators> = unknown extends TFieldValidators ? FieldValidatorMetas : FieldValidators<any, any, any> extends TFieldValidators ? FieldValidatorMetas : MappedFieldValidatorMetas<TFieldValidators>;
```

Defined in: [validation.public.ts:660](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L660)

## Type Parameters

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](FieldValidators.md)\<`any`, `any`, `any`\>
