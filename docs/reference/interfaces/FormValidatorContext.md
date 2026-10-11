---
id: FormValidatorContext
title: FormValidatorContext
---

Defined in: [validation.public.ts:711](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L711)

Values and helpers passed to a form validation function.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:725](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L725)

Creates an error map with field paths inferred from the form values.

Creates a mutable map of form errors and errors for individual field paths.

Pass the completed map back from a form or group validator to report the errors.

#### Parameters

##### initial?

`Partial`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`\>\>

An existing map to reuse. A missing `fields` object is added to it.

#### Returns

[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`\>

The initial map, if supplied, or a new map with an empty `fields` object.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [validation.public.ts:727](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L727)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [validation.public.ts:713](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L713)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:717](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L717)

The owning form on the client. `undefined` during server validation.

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:723](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L723)

Converts Standard Schema issues into form and field errors to return from this validator.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:715](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L715)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:719](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L719)

The field that caused validation, when available.

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:721](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L721)

The complete form values being validated.
