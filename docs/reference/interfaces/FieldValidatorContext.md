---
id: FieldValidatorContext
title: FieldValidatorContext
---

Defined in: [validation.public.ts:942](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L942)

Values and helpers passed to a field validation function.

## Type Parameters

### TFieldName

`TFieldName`

Library-managed. Do not specify explicitly.

### TFieldValue

`TFieldValue`

Library-managed. Do not specify explicitly.

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### event

```ts
event: ValidationTrigger;
```

Defined in: [validation.public.ts:948](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L948)

The event that caused this validation run.

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [validation.public.ts:954](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L954)

The field being validated, including when a watched field caused the event.

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation.public.ts:952](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L952)

The owning form. Read other field values here for cross-field validation.

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [validation.public.ts:958](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L958)

Converts Standard Schema issues into errors for this field, without routing their paths.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:950](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L950)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:956](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L956)

The current value of the field being validated.
