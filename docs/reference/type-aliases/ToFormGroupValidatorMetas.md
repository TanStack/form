---
id: ToFormGroupValidatorMetas
title: ToFormGroupValidatorMetas
---

# Type Alias: ToFormGroupValidatorMetas\<TGroupValidators\>

```ts
type ToFormGroupValidatorMetas<TGroupValidators> = unknown extends TGroupValidators ? FormGroupValidatorMetas : FormGroupValidators<any> extends TGroupValidators ? FormGroupValidatorMetas : MappedFormGroupValidatorMetas<TGroupValidators>;
```

Defined in: [packages/form-core/src/validation.public.ts:849](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L849)

## Type Parameters

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](FormGroupValidators.md)\<`any`\>
