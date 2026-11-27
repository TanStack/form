---
id: FieldValidatorContext
title: FieldValidatorContext
---

Defined in: [pipeline/validation/validation.public.ts:572](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L572)

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
event: "mount" | ValidationTrigger;
```

Defined in: [pipeline/validation/validation.public.ts:578](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L578)

The event that caused this validation run.

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [pipeline/validation/validation.public.ts:584](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L584)

The field being validated, including when a watched field caused the event.

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [pipeline/validation/validation.public.ts:582](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L582)

The owning form. Read other field values here for cross-field validation.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [pipeline/validation/validation.public.ts:580](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L580)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### value

```ts
value: TFieldValue;
```

Defined in: [pipeline/validation/validation.public.ts:586](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L586)

The current value of the field being validated.
