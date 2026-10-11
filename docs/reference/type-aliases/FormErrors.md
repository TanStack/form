---
id: FormErrors
title: FormErrors
---

```ts
type FormErrors<TFormErrorTypes> = ExtractFormError<TFormErrorTypes>[];
```

Defined in: [validation.public.ts:1101](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1101)

The form or group's error array, with string messages normalized to issue objects.

## Type Parameters

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)

Library-managed. Do not specify explicitly.
