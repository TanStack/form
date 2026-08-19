---
id: StandardSchemaFormOptions
title: StandardSchemaFormOptions
---

# Type Alias: StandardSchemaFormOptions\<TFormData, TFormValidators, TSubmitReturn, TComponents\>

```ts
type StandardSchemaFormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents> = FormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents> & object;
```

Defined in: [utils.public.ts:79](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L79)

Form options accepted by a schema mode when `validators` is statically known
to contain at least one Standard Schema.

Empty and callback-only validator collections are rejected because they
cannot provide schema-owned form data inference. Application code normally
receives this type through `formOptions.strictSchema`,
`formOptions.looseSchema`, or an equivalent `appFormOptions` method rather
than naming it directly.

## Type Declaration

### validators

```ts
validators: FormValidatorsWithStandardSchema<TFormValidators>;
```

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

### TComponents

`TComponents`

Library-managed. Do not specify explicitly.
