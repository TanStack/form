---
id: ParsedFieldValidator
title: ParsedFieldValidator
---

# Type Alias: ParsedFieldValidator\<TFieldValidator\>

```ts
type ParsedFieldValidator<TFieldValidator> = TFieldValidator extends object ? FieldValidatorMeta<TryGetFieldError<TFieldValidator>> : never;
```

Defined in: [validation.public.ts:616](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L616)

## Type Parameters

### TFieldValidator

`TFieldValidator` *extends* [`FieldValidator`](../interfaces/FieldValidator.md)\<`any`, `any`, `any`\>
