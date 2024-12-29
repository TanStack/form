---
id: FormValidationError
title: FormValidationError
---

# Type Alias: FormValidationError\<TFormData\>

```ts
type FormValidationError<TFormData>: object;
```

## Type Parameters

• **TFormData**

## Type declaration

### fieldErrors?

```ts
optional fieldErrors: Partial<Record<DeepKeys<TFormData>, ValidationError[]>>;
```

### formError

```ts
formError: ValidationError[] | undefined;
```

## Defined in

[packages/form-core/src/types.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L62)
