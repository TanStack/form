---
id: UnwrapFormAsyncValidateOrFn
title: UnwrapFormAsyncValidateOrFn
---

# Type Alias: UnwrapFormAsyncValidateOrFn\<TValidateOrFn\>

```ts
type UnwrapFormAsyncValidateOrFn<TValidateOrFn> = [TValidateOrFn] extends [FormValidateAsyncFn<any>] ? ExtractGlobalFormError<Awaited<ReturnType<TValidateOrFn>>> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? Record<string, StandardSchemaV1Issue[]> : undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:166](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L166)

## Type Parameters

### TValidateOrFn

`TValidateOrFn` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`any`\>
