---
id: UnwrapFormValidateOrFn
title: UnwrapFormValidateOrFn
---

# Type Alias: UnwrapFormValidateOrFn\<TValidateOrFn\>

```ts
type UnwrapFormValidateOrFn<TValidateOrFn> = [TValidateOrFn] extends [FormValidateFn<any>] ? ExtractGlobalFormError<ReturnType<TValidateOrFn>> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? Record<string, StandardSchemaV1Issue[]> : undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:112](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L112)

## Type Parameters

### TValidateOrFn

`TValidateOrFn` *extends* `undefined` \| `FormValidateOrFn`\<`any`\>
