---
id: FormGroupState
title: FormGroupState
---

# Interface: FormGroupState

Defined in: [packages/form-core/src/FormGroupApi.ts:655](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L655)

## Extended by

- [`FormGroupMeta`](FormGroupMeta.md)

## Properties

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:688](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L688)

A boolean indicating if the last submission was successful.

***

### isSubmitted

```ts
isSubmitted: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:676](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L676)

A boolean indicating if the `onSubmit` function has completed successfully.

Goes back to `false` at each new submission attempt.

Note: you can use isSubmitting to check if the form is currently submitting.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:668](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L668)

A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.

Goes back to `false` when submission completes for one of the following reasons:
- the validation step returned errors.
- the `onSubmit` function has completed.

Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.

This is useful for displaying loading indicators or disabling form inputs during submission.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:680](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L680)

A boolean indicating if the form or any of its fields are currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:684](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L684)

A counter for tracking the number of submission attempts.
