---
id: ValidationErrorMapHelper
title: ValidationErrorMapHelper
---

Defined in: [validation/state.public.ts:70](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L70)

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

Defined in: [validation/state.public.ts:78](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L78)

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

Defined in: [validation/state.public.ts:77](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L77)

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

Defined in: [validation/state.public.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L67)

#### Inherited from

```ts
Required.fields
```

***

### form

```ts
form: ValidationFailureItem[];
```

Defined in: [validation/state.public.ts:66](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L66)

#### Inherited from

```ts
Required.form
```
