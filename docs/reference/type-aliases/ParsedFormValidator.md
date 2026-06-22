---
id: ParsedFormValidator
title: ParsedFormValidator
---

# Type Alias: ParsedFormValidator\<TFormValidator\>

```ts
type ParsedFormValidator<TFormValidator> = TFormValidator extends object ? TFormValidator extends object ? FormValidatorMeta<undefined, TryGetFormError<TFormValidator>, TryGetFieldError<TFormValidator>> : FormValidatorMeta<TryGetSchemaOutput<TFormValidator>, TryGetFormError<TFormValidator>, TryGetFieldError<TFormValidator>> : never;
```

Defined in: [validation.public.ts:598](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L598)

## Type Parameters

### TFormValidator

`TFormValidator` *extends* [`FormValidator`](../interfaces/FormValidator.md)\<`any`\>
