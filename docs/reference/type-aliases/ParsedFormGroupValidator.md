---
id: ParsedFormGroupValidator
title: ParsedFormGroupValidator
---

# Type Alias: ParsedFormGroupValidator\<TGroupValidator\>

```ts
type ParsedFormGroupValidator<TGroupValidator> = TGroupValidator extends object ? TGroupValidator extends object ? FormGroupValidatorMeta<undefined, TryGetFormError<TGroupValidator>, TryGetFieldError<TGroupValidator>> : FormGroupValidatorMeta<TryGetSchemaOutput<TGroupValidator>, TryGetFormError<TGroupValidator>, TryGetFieldError<TGroupValidator>> : never;
```

Defined in: [packages/form-core/src/validation.public.ts:737](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L737)

## Type Parameters

### TGroupValidator

`TGroupValidator` *extends* [`FormGroupValidator`](../interfaces/FormGroupValidator.md)\<`any`\>
