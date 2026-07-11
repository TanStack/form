---
id: ToFormValidatorMetas
title: ToFormValidatorMetas
---

# Type Alias: ToFormValidatorMetas\<TFormValidators\>

```ts
type ToFormValidatorMetas<TFormValidators> = unknown extends TFormValidators ? FormValidatorMetas : FormValidators<any> extends TFormValidators ? FormValidatorMetas : MappedFormValidatorMetas<TFormValidators>;
```

Defined in: [packages/form-core/src/validation.public.ts:837](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L837)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
