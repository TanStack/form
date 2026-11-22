---
id: FormGroupSubmitContext
title: FormGroupSubmitContext
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:34](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L34)

Gives the group's `onSubmit` callback its submitted values, validator outputs,
form and group APIs, and error helpers after group submission validation succeeds.

- Error helpers target this group.
- Field paths in error maps and Standard Schema issues are relative to the group.

## Extends

- [`BaseSubmitContext`](BaseSubmitContext.md)\<`TGroupValue`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TGroupName

`TGroupName`

Library-managed. Do not specify explicitly.

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.

### TOutputs

`TOutputs`

Library-managed. Do not specify explicitly.

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateSubmitErrorMapFn<TGroupValue>;
```

Defined in: [FormApi/formSubmit.public.ts:172](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L172)

Builds a mutable map of submission errors from optional initial errors.

- If you already have errors ready to return, use
  [createValidationError](BaseSubmitContext.md#createvalidationerror).
- If you want to return Standard Schema errors, use
  [parseIssues](BaseSubmitContext.md#parseissues).
- Add errors with `addFormError` and `addFieldError`.
- Return the map from `onSubmit` to report its errors.
- The `form` entry targets the submitting form or group.
- Field paths are relative to the submitting form or group.
- An empty map indicates success.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createErrorMap }) => {
    const errors = createErrorMap()
    if (await nameIsTaken(value.name)) {
      errors.addFieldError('name', 'Name is already taken')
    }
    return errors
  },
})
```

#### Inherited from

[`BaseSubmitContext`](BaseSubmitContext.md).[`createErrorMap`](BaseSubmitContext.md#createerrormap)

***

### createValidationError

```ts
createValidationError: CreateValidationErrorFn<TGroupValue>;
```

Defined in: [FormApi/formSubmit.public.ts:144](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L144)

Wraps existing errors so `onSubmit` can return them as validation errors.
Calling this helper alone does not update validation state.

Accepts error messages, issue objects, arrays of errors, or an error map.
For a group, field paths in an error map are relative to the group.

- If you want to build or edit errors by field, use
  [createErrorMap](BaseSubmitContext.md#createerrormap).
- If you want to return Standard Schema errors, use
  [parseIssues](BaseSubmitContext.md#parseissues).

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createValidationError }) => {
    if (await nameIsTaken(value.name)) {
      return createValidationError('Name is already taken')
    }
    await saveProfile(value)
  },
})
```

#### Inherited from

[`BaseSubmitContext`](BaseSubmitContext.md).[`createValidationError`](BaseSubmitContext.md#createvalidationerror)

***

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:57](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L57)

The form containing this group.

#### Remarks

**Important:** A user may edit fields during submission. `value` may differ
from the group values in `formApi.state.values`.

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupError, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:65](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L65)

The group handling this submission.

#### Remarks

**Important:** A user may edit fields during submission. `value` and `groupApi.value` may not
be equal.

***

### parseIssues

```ts
parseIssues: ParseSubmitIssuesFn<TGroupValue>;
```

Defined in: [FormApi/formSubmit.public.ts:200](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L200)

Converts Standard Schema issues into a mutable error map to return from
`onSubmit`.

- If you want to return your own error messages or an existing error map, use
  [createValidationError](BaseSubmitContext.md#createvalidationerror).
- If you want to build or edit errors by field, use
  [createErrorMap](BaseSubmitContext.md#createerrormap).
- Uses the captured submission values to resolve field paths.
- Issues without a field path become form or group errors.
- For a group, issue paths are relative to the group.
- Return the map to report its errors. An empty map indicates success.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, parseIssues }) => {
    const result = parseSchema(mySchema, value)
    if (!result.success) {
      return parseIssues(result.issues)
    }
    await saveProfile(result.data)
  },
})
```

#### Inherited from

[`BaseSubmitContext`](BaseSubmitContext.md).[`parseIssues`](BaseSubmitContext.md#parseissues)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [FormApi/formSubmit.public.ts:118](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L118)

Signals when this submission attempt is invalidated.

- A newer submission of the same form or group aborts the signal.
- A reset or unmount also aborts it.
- Field edits during a submission do not abort the signal.
- The same signal is passed to this attempt's `onSubmitInvalid`, if it runs.

#### Remarks

**Important:** Aborting prevents submission results from updating form or
group state. Callbacks already started are still awaited, and their
exceptions retain normal handling. Use the signal to stop external work
that supports cancellation.

#### Inherited from

[`BaseSubmitContext`](BaseSubmitContext.md).[`signal`](BaseSubmitContext.md#signal)

***

### validatorOutputs

```ts
validatorOutputs: TOutputs;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:99](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L99)

Outputs from this submission's group validators, in validators array order.

- Standard Schemas provide their parsed output data automatically.
- Callback validators provide the payload returned with `createOutput`.
- Skipped validators contribute `undefined`.
- Outputs from earlier change, blur, or mount validation are not reused.

#### Example

```ts
{
  // ...
  validators: [
    {
      triggers: [],
      run: ({ createOutput, value }) =>
        createOutput({ displayName: value.name.trim() }),
    },
    { triggers: [], run: mySchema },
  ],
  onSubmit: async ({ validatorOutputs }) => {
    const [customData, schemaOutput] = validatorOutputs
    await saveProfile(customData.displayName, schemaOutput)
  },
}
```

***

### value

```ts
value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:49](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L49)

The group values captured when this submission started, without schema
transformations applied.

Field edits made while submission is pending do not replace these values.
Read transformed group validator results from `validatorOutputs`.
