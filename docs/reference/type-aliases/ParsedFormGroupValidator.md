---
id: ParsedFormGroupValidator
title: ParsedFormGroupValidator
---

# Type Alias: ParsedFormGroupValidator\<TGroupValidator\>

```ts
type ParsedFormGroupValidator<TGroupValidator> = TGroupValidator extends object ? TGroupValidator extends object ? FormGroupValidatorMeta<undefined, TryGetFormError<TGroupValidator>, TryGetFieldError<TGroupValidator>> : FormGroupValidatorMeta<TryGetSchemaOutput<TGroupValidator>, TryGetFormError<TGroupValidator>, TryGetFieldError<TGroupValidator>> : never;
```

Defined in: [packages/form-core/src/validation.public.ts:780](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L780)

## Type Parameters

### TGroupValidator

`TGroupValidator` *extends* [`FormGroupValidator`](../interfaces/FormGroupValidator.md)\<`any`\>
