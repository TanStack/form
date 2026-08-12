---
id: FieldListenerContext
title: FieldListenerContext
---

# Interface: FieldListenerContext\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [listeners.public.ts:339](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L339)

Context passed to a field listener.

## Type Parameters

### TFieldName

`TFieldName`

Library-managed. Do not specify explicitly.

### TFieldValue

`TFieldValue`

Library-managed. Do not specify explicitly.

### TFieldError

`TFieldError`

Library-managed. Do not specify explicitly.

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>;
```

Defined in: [listeners.public.ts:354](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L354)

The field that owns the listener.

This remains the listening field when an event arrives through
`watchFields`.

***

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [listeners.public.ts:362](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L362)

The form that owns the field.

***

### value

```ts
value: TFieldValue;
```

Defined in: [listeners.public.ts:347](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L347)

The listening field's value captured when the event occurred.
