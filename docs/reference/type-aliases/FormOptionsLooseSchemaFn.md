---
id: FormOptionsLooseSchemaFn
title: FormOptionsLooseSchemaFn
---

```ts
type FormOptionsLooseSchemaFn<TPayload> = <TSchema, TFormData, TValidatorConfig, TValidators, TSubmitReturn>(schema, options) => InferredFormOptions<InferUnion<TFormData, StandardSchemaInput<TSchema>>, TValidators, TSubmitReturn, TPayload>;
```

Defined in: [FormApi/formOptions.public.ts:304](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L304)

Function type for creating form options from a Standard Schema with defaults
that may omit properties or contain `null` or `undefined`.

## Type Parameters

### TPayload

`TPayload`

Library-managed. Do not specify explicitly.

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TFormData

`TFormData` *extends* [`Editable`](Editable.md)\<[`StandardSchemaInput`](StandardSchemaInput.md)\<`TSchema`\>\>

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

`LooseSchemaFormOptions`\<[`StandardSchemaInput`](StandardSchemaInput.md)\<`TSchema`\>, `TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`\>

## Returns

`InferredFormOptions`\<[`InferUnion`](InferUnion.md)\<`TFormData`, [`StandardSchemaInput`](StandardSchemaInput.md)\<`TSchema`\>\>, `TValidators`, `TSubmitReturn`, `TPayload`\>

The supplied options object unchanged.
