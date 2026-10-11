---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

Defined in: [validation.public.ts:735](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L735)

Values and helpers passed to a server form validation function.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:749](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L749)

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

Defined in: [validation.public.ts:751](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L751)

Creates a successful result to return data in this validator's server `validatorOutputs` entry.

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [validation.public.ts:737](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L737)

The validation event. `serverValidate` supplies `'server'`.

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:741](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L741)

`undefined` during server validation, where no client form instance exists.

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:747](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L747)

Converts Standard Schema issues into form and field errors to return from this validator.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:739](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L739)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:743](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L743)

Absent during server validation, which is not triggered by a client field.

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:745](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L745)

The complete form values passed to server validation.
