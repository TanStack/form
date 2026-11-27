---
id: GetValidatorOutputs
title: GetValidatorOutputs
---

```ts
type GetValidatorOutputs<TValidators> = { [K in keyof TValidators]: GetValidatorOutput<TValidators[K]> };
```

Defined in: [FormApi/formSubmit.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L56)

Infers form validators' submission output types in configuration order.

Standard Schemas contribute their parsed output types. Validator functions
contribute the payload types of their `createOutput` results, including
results returned in promises. Successful returns without an output contribute
`undefined`.

`skipOnSubmit: true` makes an entry `undefined`. A callback or `boolean`
condition allows `undefined` alongside the validator's output type.

## Type Parameters

### TValidators

`TValidators` *extends* `ReadonlyArray`\<`unknown`\>

Library-managed. Do not specify explicitly.
