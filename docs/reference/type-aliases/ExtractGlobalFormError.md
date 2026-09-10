---
id: ExtractGlobalFormError
title: ExtractGlobalFormError
---

# Type Alias: ExtractGlobalFormError\<TFormError\>

```ts
type ExtractGlobalFormError<TFormError> = TFormError extends GlobalFormValidationError<any> ? TFormError["form"] : TFormError;
```

Defined in: [packages/form-core/src/types.ts:154](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L154)

## Type Parameters

### TFormError

`TFormError`
