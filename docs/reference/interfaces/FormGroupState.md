---
id: FormGroupState
title: FormGroupState
---

# Interface: FormGroupState\<TGroupValue, TGroupValidationMetas\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:103](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L103)

## Type Parameters

### TGroupValue

`TGroupValue`

### TGroupValidationMetas

`TGroupValidationMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:115](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L115)

***

### errors

```ts
errors: TGroupValidationMetas[number]["groupError"];
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:109](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L109)

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:111](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L111)

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:114](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L114)

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:112](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L112)

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:117](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L117)

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:116](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L116)

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:110](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L110)

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:113](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L113)

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:118](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L118)

***

### meta

```ts
meta: unknown;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:108](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L108)

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:119](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L119)

***

### values

```ts
values: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:107](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L107)
