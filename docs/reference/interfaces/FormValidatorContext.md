---
id: FormValidatorContext
title: FormValidatorContext
---

Defined in: [pipeline/validation/validation.public.ts:454](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L454)

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

Defined in: [pipeline/validation/validation.public.ts:466](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L466)

Builds a mutable error map from optional form and field errors.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [pipeline/validation/validation.public.ts:470](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L470)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: 
  | "server"
  | "mount"
  | ValidationTrigger;
```

Defined in: [pipeline/validation/validation.public.ts:456](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L456)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [pipeline/validation/validation.public.ts:460](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L460)

The owning form on the client. `undefined` during server validation.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [pipeline/validation/validation.public.ts:468](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L468)

Converts Standard Schema issues into a mutable error map using the form values.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [pipeline/validation/validation.public.ts:458](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L458)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/validation.public.ts:462](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L462)

The field that caused validation, when available.

***

### value

```ts
value: TFormData;
```

Defined in: [pipeline/validation/validation.public.ts:464](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L464)

The complete form values being validated.
