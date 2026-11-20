---
id: FieldValidatorContext
title: FieldValidatorContext
---

Defined in: [validation.public.ts:660](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L660)

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

Defined in: [validation.public.ts:666](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L666)

The event that caused this validation run.

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [validation.public.ts:672](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L672)

The field being validated, including when a watched field caused the event.

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation.public.ts:670](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L670)

The owning form. Read other field values here for cross-field validation.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:668](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L668)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:674](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L674)

The current value of the field being validated.
