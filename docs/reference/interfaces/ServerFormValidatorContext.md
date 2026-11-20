---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

Defined in: [validation.public.ts:538](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L538)

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

Defined in: [validation.public.ts:550](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L550)

Builds a mutable error map from optional form and field errors.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [validation.public.ts:554](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L554)

Creates a successful result to return data in this validator's server `validatorOutputs` entry.

***

### event

```ts
event: "server" | ValidationTrigger;
```

Defined in: [validation.public.ts:540](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L540)

The validation event. `serverValidate` supplies `'server'`.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:544](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L544)

`undefined` during server validation, where no client form instance exists.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:552](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L552)

Converts Standard Schema issues into a mutable error map using the server values.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:542](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L542)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:546](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L546)

Absent during server validation, which is not triggered by a client field.

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:548](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L548)

The complete form values passed to server validation.
