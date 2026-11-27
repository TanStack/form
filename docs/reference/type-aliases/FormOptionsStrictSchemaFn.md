---
id: FormOptionsStrictSchemaFn
title: FormOptionsStrictSchemaFn
---

```ts
type FormOptionsStrictSchemaFn<TPayload> = <TSchema, TValidatorConfig, TValidators, TSubmitReturn>(schema, options) => InferredFormOptions<NoInfer<StandardSchemaInput<TSchema>>, TValidators, TSubmitReturn, TPayload>;
```

Defined in: [FormApi/formOptions.public.ts:252](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L252)

Function type for creating form options whose default values match a Standard
Schema's input type.

## Type Parameters

### TPayload

`TPayload`

Library-managed. Do not specify explicitly.

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

Library-managed. Do not specify explicitly.

### TValidators

`TValidators`

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### schema

`TSchema`

### options

[`FormOptions`](../interfaces/FormOptions.md)\<`NoInfer`\<[`StandardSchemaInput`](StandardSchemaInput.md)\<`TSchema`\>\>, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

## Returns

`InferredFormOptions`\<`NoInfer`\<[`StandardSchemaInput`](StandardSchemaInput.md)\<`TSchema`\>\>, `TValidators`, `TSubmitReturn`, `TPayload`\>

The supplied options object unchanged.
