---
id: ToFormErrorTypes
title: ToFormErrorTypes
---

```ts
type ToFormErrorTypes<TFormValidators, TSubmitReturn> = ToValidatorErrorTypes<TFormValidators, FormValidators<any>, TSubmitReturn>;
```

Defined in: [validation.public.ts:1313](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1313)

Infers form and routed field issue types from validators and submission validation errors.

String errors become `ValidationIssue` objects. Successful output payloads
are excluded from error types.

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.
