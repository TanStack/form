---
id: SubmitInvalidContext
title: SubmitInvalidContext
---

Defined in: [FormApi/formSubmit.public.ts:281](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L281)

Identifies why a form or form-group submission failed and lets
`onSubmitInvalid` suppress its exception.

## Extended by

- [`FormSubmitInvalidContext`](FormSubmitInvalidContext.md)
- [`FormGroupSubmitInvalidContext`](FormGroupSubmitInvalidContext.md)

## Properties

### error

```ts
error: unknown;
```

Defined in: [FormApi/formSubmit.public.ts:308](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L308)

The exception from validation or `onSubmit`. Always `undefined` when
`reason` is `validation`.

An exception can also be `undefined`; check `reason` to distinguish the cases.

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

***

### reason

```ts
reason: "exception" | "validation";
```

Defined in: [FormApi/formSubmit.public.ts:295](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L295)

How submission failed:
- `validation` for reported validation errors
- `exception` for a thrown value or rejected promise

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

***

### source

```ts
source: "onSubmit" | "validators";
```

Defined in: [FormApi/formSubmit.public.ts:301](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L301)

Where submission failed:
- `validators` failed during field and form or form-group validation
- `onSubmit` failed during the `onSubmit` handler
