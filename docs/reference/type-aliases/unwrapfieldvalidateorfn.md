---
id: UnwrapFieldValidateOrFn
title: UnwrapFieldValidateOrFn
---

# Type Alias: UnwrapFieldValidateOrFn\<TParentData, TName, TValidateOrFn, TFormValidateOrFn\>

```ts
type UnwrapFieldValidateOrFn<TParentData, TName, TValidateOrFn, TFormValidateOrFn> = 
  | [TFormValidateOrFn] extends [StandardSchemaV1<any, infer TStandardOut>] ? TName extends keyof TStandardOut ? StandardSchemaV1Issue[] : undefined : undefined
  | UnwrapFormValidateOrFn<TFormValidateOrFn> extends infer TFormValidateVal ? TFormValidateVal extends object ? TName extends keyof TFormValidateVal["fields"] ? TFormValidateVal["fields"][TName] : undefined : undefined : never
  | [TValidateOrFn] extends [FieldValidateFn<any, any, any>] ? ReturnType<TValidateOrFn> : [TValidateOrFn] extends [StandardSchemaV1<any, any>] ? StandardSchemaV1Issue[] : undefined;
```

Defined in: [packages/form-core/src/FieldApi.ts:114](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L114)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](deepkeys.md)\<`TParentData`\>

• **TValidateOrFn** *extends* `undefined` \| `FieldValidateOrFn`\<`any`, `any`, `any`\>

• **TFormValidateOrFn** *extends* `undefined` \| `FormValidateOrFn`\<`any`\>
