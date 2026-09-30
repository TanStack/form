---
id: ExtractGlobalFormError
title: ExtractGlobalFormError
---

```ts
type ExtractGlobalFormError<TFormError> = TFormError extends GlobalFormValidationError<any> ? TFormError["form"] : TFormError;
```

Defined in: [packages/form-core/src/types.ts:146](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L146)

## Type Parameters

### TFormError

`TFormError`
