---
id: FormValidatorServerContext
title: FormValidatorServerContext
---

Defined in: [pipeline/validation/formValidators.public.ts:126](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L126)

Form values and result helpers passed to a validator during server validation.

## Extends

- `BaseFormValidatorContext`\<`TFormData`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TEvents

`TEvents` *extends* [`ServerSideEvents`](../type-aliases/ServerSideEvents.md)

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [pipeline/validation/formValidators.public.ts:70](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L70)

Builds a mutable error map for the form and its field paths from optional
initial errors. Return the created map to report its errors.

Returning an empty error map is considered successful validation.

#### Example

```ts
formOptions({
  defaultValues: { name: '', email: '' },
  validators: [
    {
      run: ({ createErrorMap, value }) => {
        // Return a map directly.
        if (value.name.trim().length > 0) return;
        return createErrorMap({
          form: 'Please check your details',
          fields: { name: 'Name is required' },
        });
      },
    },
    {
      run: ({ createErrorMap, value }) => {
        // Collect errors before returning the map.
        const errors = createErrorMap()

        if (value.name.trim().length === 0) {
          errors.fields.name = 'Name is required'
        }
        if (value.email.trim().length === 0) {
          errors.fields.email = 'Email is required'
        }

        return errors
      },
    },
  ],
})
```

#### Inherited from

```ts
BaseFormValidatorContext.createErrorMap
```

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [pipeline/validation/formValidators.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L117)

Use this to return custom data when validation succeeds. The data is
available in `validatorOutputs` during submission or server validation.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: ({ createOutput, value }) => {
        return createOutput({ displayName: value.name.trim() })
      },
    },
    {
      // Schemas pass their output data by default.
      run: mySchema
    }
  ],
  onSubmit: ({ validatorOutputs }) => {
    // Outputs follow the same order as the validators array.
    const [customData, schemaOutput] = validatorOutputs
    console.log(customData.displayName)
  },
})
```

#### Inherited from

```ts
BaseFormValidatorContext.createOutput
```

***

### event

```ts
event: TEvents;
```

Defined in: [pipeline/validation/formValidators.public.ts:137](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L137)

The event that caused this validation run.

- `'server'`: Form values are being validated on the server.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [pipeline/validation/formValidators.public.ts:89](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L89)

Converts Standard Schema issues into a mutable error map to return from
this validator.

By default, issues with field paths are grouped in `fields`, and issues
without a field path go in `form`. The validator's `fieldErrorTarget`
option can report field issues in both places or only in `form`.

#### Example

```ts
run: ({ value, parseIssues }) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return parseIssues(result.error.issues)
  }
}
```

#### Inherited from

```ts
BaseFormValidatorContext.parseIssues
```

***

### value

```ts
value: TFormData;
```

Defined in: [pipeline/validation/formValidators.public.ts:131](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L131)

The complete form values decoded from `FormData` for server validation.
