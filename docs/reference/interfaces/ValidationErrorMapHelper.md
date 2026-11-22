---
id: ValidationErrorMapHelper
title: ValidationErrorMapHelper
---

Defined in: [validation/results/results.public.ts:66](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L66)

## Extends

- `Required`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`, [`ValidationFailureItem`](../type-aliases/ValidationFailureItem.md)[], [`ValidationFailureItem`](../type-aliases/ValidationFailureItem.md)[]\>\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### addFieldError

```ts
addFieldError: (name, error) => void;
```

Defined in: [validation/results/results.public.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L74)

#### Parameters

##### name

[`DeepKeys`](../type-aliases/DeepKeys.md)\<`TFormData`\>

##### error

[`ValidationFailure`](../type-aliases/ValidationFailure.md)

#### Returns

`void`

***

### addFormError

```ts
addFormError: (error) => void;
```

Defined in: [validation/results/results.public.ts:73](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L73)

#### Parameters

##### error

[`ValidationFailure`](../type-aliases/ValidationFailure.md)

#### Returns

`void`

***

### fields

```ts
fields: ValidationFieldMap<TFormData, TFieldError>;
```

Defined in: [validation/results/results.public.ts:63](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L63)

#### Inherited from

```ts
Required.fields
```

***

### form

```ts
form: ValidationFailureItem[];
```

Defined in: [validation/results/results.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L62)

#### Inherited from

```ts
Required.form
```
