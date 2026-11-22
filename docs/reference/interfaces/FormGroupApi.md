---
id: FormGroupApi
title: FormGroupApi
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:296](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L296)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

## Properties

### atom

```ts
atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupError>>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:306](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L306)

***

### form

```ts
readonly form: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:303](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L303)

***

### handleSubmit

```ts
handleSubmit: () => Promise<FormattedValidationError<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:319](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L319)

Submits the group and returns a flat array of issues and error maps.

Exceptions reject after submission state is cleaned up, unless
`onSubmitInvalid` calls `preventThrow()`.

#### Returns

`Promise`\<[`FormattedValidationError`](../type-aliases/FormattedValidationError.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:304](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L304)

***

### reset

```ts
reset: () => void;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:320](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L320)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:307](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L307)

***

### validate

```ts
validate: (signal) => Promise<FormattedValidationError<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:310](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L310)

Returns a flat array of issues and error maps with group-relative field paths.

#### Parameters

##### signal

[`DynamicValidatorTriggers`](../type-aliases/DynamicValidatorTriggers.md)

#### Returns

`Promise`\<[`FormattedValidationError`](../type-aliases/FormattedValidationError.md)\<`TGroupValue`\>[]\>

***

### value

```ts
readonly value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:308](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L308)
