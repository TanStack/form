---
id: FormOptionsStrictSchemaFn
title: FormOptionsStrictSchemaFn
---

# Type Alias: FormOptionsStrictSchemaFn\<TComponents\>

```ts
type FormOptionsStrictSchemaFn<TComponents> = <TSchema, TFormValidators, TSubmitReturn>(schema, options) => FormOptions<StandardSchemaInput<TSchema>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [utils.public.ts:114](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L114)

Types strict form options using a separate schema as the source of the form
data type.

The schema input fixes the form data type before the options are inferred,
so `defaultValues` and each callback validator's `value` use the exact
schema input type.

The first argument is used only by TypeScript and is ignored at runtime.
Include the schema in `validators` as well when it should validate the form.
Parsed results are available in the corresponding `schemaOutputs` entries
during submission.

## Type Parameters

### TComponents

`TComponents`

Library-managed. Do not specify explicitly.

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`StandardSchemaInput`\<`TSchema`\>\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### schema

`TSchema`

Supplies the form data type without registering a validator.

### options

[`FormOptions`](../interfaces/FormOptions.md)\<`StandardSchemaInput`\<`TSchema`\>, `TFormValidators`, `TSubmitReturn`, `unknown`\>

The form options to type against the schema input.

## Returns

[`FormOptions`](../interfaces/FormOptions.md)\<`StandardSchemaInput`\<`TSchema`\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

The original options object, normalized to `FormOptions` with the
schema input as its form data type.

## Example

```ts
const profileSchema = z.object({ name: z.string().min(1) })
const profileOptions = formOptions.strictSchema(profileSchema, {
  defaultValues: { name: '' },
  validators: [
    { triggers: ['change'], run: profileSchema },
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.name.length === 0 ? 'Name is required' : undefined,
    },
  ],
})
```
