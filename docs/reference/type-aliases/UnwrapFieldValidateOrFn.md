---
id: UnwrapFieldValidateOrFn
title: UnwrapFieldValidateOrFn
---

# Type Alias: UnwrapFieldValidateOrFn\<TName, TValidateOrFn, TFormValidateOrFn\>

```ts
type UnwrapFieldValidateOrFn<TName, TValidateOrFn, TFormValidateOrFn> = 
  | [TFormValidateOrFn] extends [StandardSchemaV1<any, infer TStandardOut>] ? TName extends keyof TStandardOut ? StandardSchemaV1Issue[] : undefined : undefined
  | UnwrapFormValidateOrFnForInner<TFormValidateOrFn> extends infer TFormValidateVal ? TFormValidateVal extends object ? [DeepValue<TFormValidateVal, TName>] extends [never] ? undefined : StandardSchemaV1Issue[] : TFormValidateVal extends object ? TName extends keyof TFormValidateVal["fields"] ? TFormValidateVal["fields"][TName] : undefined : undefined : never
  | [TValidateOrFn] extends [FieldValidateFn<any, any, any>] ? ReturnType<TValidateOrFn> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? StandardSchemaV1Issue[] : undefined;
```

Defined in: [packages/form-core/src/FieldApi.ts:135](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L135)

## Type Parameters

### TName

`TName` *extends* `string`

### TValidateOrFn

`TValidateOrFn` *extends* `undefined` \| `FieldValidateOrFn`\<`any`, `any`, `any`\>

### TFormValidateOrFn

`TFormValidateOrFn` *extends* `undefined` \| `FormValidateOrFn`\<`any`\>
