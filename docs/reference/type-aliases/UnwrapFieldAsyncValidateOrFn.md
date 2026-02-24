---
id: UnwrapFieldAsyncValidateOrFn
title: UnwrapFieldAsyncValidateOrFn
---

# Type Alias: UnwrapFieldAsyncValidateOrFn\<TName, TValidateOrFn, TFormValidateOrFn\>

```ts
type UnwrapFieldAsyncValidateOrFn<TName, TValidateOrFn, TFormValidateOrFn> = 
  | [TFormValidateOrFn] extends [StandardSchemaV1<any, infer TStandardOut>] ? TName extends keyof TStandardOut ? StandardSchemaV1Issue[] : undefined : undefined
  | UnwrapFormAsyncValidateOrFnForInner<TFormValidateOrFn> extends infer TFormValidateVal ? TFormValidateVal extends object ? [DeepValue<TFormValidateVal, TName>] extends [never] ? undefined : StandardSchemaV1Issue[] : TFormValidateVal extends object ? TName extends keyof TFormValidateVal["fields"] ? TFormValidateVal["fields"][TName] : undefined : undefined : never
  | [TValidateOrFn] extends [FieldValidateAsyncFn<any, any, any>] ? Awaited<ReturnType<TValidateOrFn>> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? StandardSchemaV1Issue[] : undefined;
```

Defined in: [packages/form-core/src/FieldApi.ts:221](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L221)

## Type Parameters

### TName

`TName` *extends* `string`

### TValidateOrFn

`TValidateOrFn` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`any`, `any`, `any`\>

### TFormValidateOrFn

`TFormValidateOrFn` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`any`\>
