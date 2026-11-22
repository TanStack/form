---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

Defined in: [pipeline/validation/validation.public.ts:478](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L478)

Values and helpers passed to a server form validation function.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [pipeline/validation/validation.public.ts:490](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L490)

Builds a mutable error map from optional form and field errors.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [pipeline/validation/validation.public.ts:494](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L494)

Creates a successful result to return data in this validator's server `validatorOutputs` entry.

***

### event

```ts
event: "server" | ValidationTrigger;
```

Defined in: [pipeline/validation/validation.public.ts:480](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L480)

The validation event. `serverValidate` supplies `'server'`.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [pipeline/validation/validation.public.ts:484](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L484)

`undefined` during server validation, where no client form instance exists.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [pipeline/validation/validation.public.ts:492](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L492)

Converts Standard Schema issues into a mutable error map using the server values.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [pipeline/validation/validation.public.ts:482](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L482)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/validation.public.ts:486](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L486)

Absent during server validation, which is not triggered by a client field.

***

### value

```ts
value: TFormData;
```

Defined in: [pipeline/validation/validation.public.ts:488](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L488)

The complete form values passed to server validation.
