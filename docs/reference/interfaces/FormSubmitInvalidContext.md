---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

Defined in: [FormApi/formSubmit.public.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L337)

Gives `onSubmitInvalid` the submitted values, form instance, and details of a
validation failure or exception.

## Remarks

**Important:** Handling an exception in `onSubmitInvalid` does not prevent
`handleSubmit()` from rejecting. Call `preventThrow()` during the callback
to suppress the submission's exception.

## Extends

- [`SubmitInvalidContext`](SubmitInvalidContext.md)

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### error

```ts
error: unknown;
```

Defined in: [FormApi/formSubmit.public.ts:308](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L308)

The exception from validation or `onSubmit`. Always `undefined` when
`reason` is `validation`.

An exception can also be `undefined`; check `reason` to distinguish the cases.

#### Inherited from

[`SubmitInvalidContext`](SubmitInvalidContext.md).[`error`](SubmitInvalidContext.md#error)

***

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [FormApi/formSubmit.public.ts:352](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L352)

The form whose submission failed. Use `formApi.state` to inspect current
values and validation state, including edits made since submission started.

***

### preventThrow

```ts
preventThrow: () => void;
```

Defined in: [FormApi/formSubmit.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L322)

Prevents this submission's exception from rejecting `handleSubmit()`.

Call during `onSubmitInvalid`, before it returns or its returned promise
settles. Has no effect when `reason` is `validation`.

The submission remains unsuccessful. `handleSubmit()` resolves with any
collected validation errors, or an empty array.

#### Returns

`void`

#### Remarks

**Important:** This does not suppress exceptions thrown or rejected by
`onSubmitInvalid` itself.

#### Inherited from

[`SubmitInvalidContext`](SubmitInvalidContext.md).[`preventThrow`](SubmitInvalidContext.md#preventthrow)

***

### reason

```ts
reason: "exception" | "validation";
```

Defined in: [FormApi/formSubmit.public.ts:295](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L295)

How submission failed:
- `validation` for reported validation errors
- `exception` for a thrown value or rejected promise

#### Inherited from

[`SubmitInvalidContext`](SubmitInvalidContext.md).[`reason`](SubmitInvalidContext.md#reason)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [FormApi/formSubmit.public.ts:289](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L289)

The same signal passed to this attempt's `onSubmit`, if it ran.

Aborted when the attempt is superseded or invalidated by reset, unmount, or
server-state replacement. A running callback is still awaited. An aborted
signal does not change `reason` or automatically suppress exceptions.

#### Inherited from

[`SubmitInvalidContext`](SubmitInvalidContext.md).[`signal`](SubmitInvalidContext.md#signal)

***

### source

```ts
source: "onSubmit" | "validators";
```

Defined in: [FormApi/formSubmit.public.ts:301](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L301)

Where submission failed:
- `validators` failed during field and form or form-group validation
- `onSubmit` failed during the `onSubmit` handler

#### Inherited from

[`SubmitInvalidContext`](SubmitInvalidContext.md).[`source`](SubmitInvalidContext.md#source)

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/formSubmit.public.ts:347](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L347)

The form values captured when this submission started, without schema
transformations applied.

Field edits made while submission is pending do not replace these values.
