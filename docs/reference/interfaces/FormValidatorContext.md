---
id: FormValidatorContext
title: FormValidatorContext
---

Defined in: [validation.public.ts:514](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L514)

Values and helpers passed to a form validation function.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [validation.public.ts:526](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L526)

Builds a mutable error map from optional form and field errors.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [validation.public.ts:530](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L530)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: 
  | "server"
  | "mount"
  | ValidationTrigger;
```

Defined in: [validation.public.ts:516](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L516)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:520](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L520)

The owning form on the client. `undefined` during server validation.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:528](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L528)

Converts Standard Schema issues into a mutable error map using the form values.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:518](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L518)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:522](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L522)

The field that caused validation, when available.

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:524](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L524)

The complete form values being validated.
