---
id: FormOptionsApi
title: FormOptionsApi
---

Defined in: [FormApi/formOptions.public.ts:332](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L332)

The form-options helper type used by `formOptions` and adapter helpers such
as `appFormOptions` to retain registered component types.

## Type Parameters

### TPayload

`TPayload`

Library-managed. Do not specify explicitly.

```ts
FormOptionsApi<TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options): InferredFormOptions<TFormData, TValidators, TSubmitReturn, TPayload>;
```

Defined in: [FormApi/formOptions.public.ts:341](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L341)

Infers form values, validator settings, and callback types for reusable
options.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

Library-managed. Do not specify explicitly.

### TValidators

`TValidators`

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

[`FormOptions`](FormOptions.md)\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

## Returns

`InferredFormOptions`\<`TFormData`, `TValidators`, `TSubmitReturn`, `TPayload`\>

## Properties

### looseSchema

```ts
looseSchema: FormOptionsLooseSchemaFn<TPayload>;
```

Defined in: [FormApi/formOptions.public.ts:392](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L392)

Defines form options from a Standard Schema's input type while allowing
defaults to omit properties or use `null` or `undefined`.

These empty states remain part of the form's value types, including inside
callbacks. This also applies to nested objects and array items.

The schema supplies the value types without running validation. Add it to
`validators` when it should also validate the form.

#### Example

```ts
// schema input: { name: string; age: number }
const profileOptions = formOptions.looseSchema(schema, {
  defaultValues: { age: null },
  validators: [{ run: schema }],
})
```

***

### strictSchema

```ts
strictSchema: FormOptionsStrictSchemaFn<TPayload>;
```

Defined in: [FormApi/formOptions.public.ts:372](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L372)

Defines form options whose values follow a Standard Schema's input type.
Default values must match that type, including any required properties.

The schema supplies the value types without running validation. Add it to
`validators` when it should also validate the form.

#### Example

```ts
// schema input: { name: string; age: number }
const profileOptions = formOptions.strictSchema(schema, {
  defaultValues: { name: '', age: 0 },
  validators: [{ run: schema }],
})
```
