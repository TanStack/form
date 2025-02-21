---
id: UnwrapFormValidateOrFn
title: UnwrapFormValidateOrFn
---

# Type Alias: UnwrapFormValidateOrFn\<TValidateOrFn\>

```ts
type UnwrapFormValidateOrFn<TValidateOrFn> = [TValidateOrFn] extends [FormValidateFn<any>] ? ReturnType<TValidateOrFn> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? Record<string, StandardSchemaV1Issue[]> : undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L88)

## Type Parameters

• **TValidateOrFn** *extends* `undefined` \| `FormValidateOrFn`\<`any`\>
