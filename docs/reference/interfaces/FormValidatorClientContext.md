---
id: FormValidatorClientContext
title: FormValidatorClientContext
---

Defined in: [validation/formValidators.public.ts:167](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L167)

Form values, result helpers, and form access passed to a validator for change,
blur, or submission events.

## Extends

- `BaseFormValidatorContext`\<`TFormData`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TEvents

`TEvents` *extends* [`ClientSideEvents`](../type-aliases/ClientSideEvents.md)

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [validation/formValidators.public.ts:70](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L70)

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

Defined in: [validation/formValidators.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L117)

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

Defined in: [validation/formValidators.public.ts:180](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L180)

The event that caused this validation run.

- `'change'`: A form value changed.
- `'blur'`: A field was blurred.
- `'submit'`: A form submission was attempted.

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation/formValidators.public.ts:182](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L182)

The form instance that owns this validator.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [validation/formValidators.public.ts:89](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L89)

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

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation/formValidators.public.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L187)

Aborted when this validation run is cancelled. Pass it to asynchronous work
such as `fetch` to cancel that work too.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation/formValidators.public.ts:192](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L192)

The field whose change or blur triggered validation. `undefined` when no
field triggered the run.

***

### value

```ts
value: TFormData;
```

Defined in: [validation/formValidators.public.ts:172](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L172)

The complete form values being validated in this run.
