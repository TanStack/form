---
id: AngularFormType
title: AngularFormType
---

# Type Alias: AngularFormType\<TOptions\>

```ts
type AngularFormType<TOptions> = TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? InternalFormApi<TFormData, TFormValidators, AngularFormTypeSubmitReturn<TSubmitReturn>> : never;
```

Defined in: [form-type.ts:17](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-type.ts#L17)

Resolves a reusable options object to its concrete Angular form type.

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`
