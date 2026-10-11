---
id: FormErrorTypes
title: FormErrorTypes
---

Defined in: [validation.public.ts:1051](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1051)

Inferred issue types for errors owned by a form or group and errors routed to its fields.

## Type Parameters

### TFormError

`TFormError` = [`ValidationIssue`](ValidationIssue.md)

Library-managed. Do not specify explicitly.

### TFieldError

`TFieldError` = [`ValidationIssue`](ValidationIssue.md)

Library-managed. Do not specify explicitly.

## Properties

### fieldError

```ts
readonly fieldError: TFieldError;
```

Defined in: [validation.public.ts:1058](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1058)

The issue type routed from form or group validation to individual fields.

***

### formError

```ts
readonly formError: TFormError;
```

Defined in: [validation.public.ts:1056](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1056)

The issue type stored in the form or group's `state.errors`.
