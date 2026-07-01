---
id: ValidationErrorMap
title: ValidationErrorMap
---

# Interface: ValidationErrorMap\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:310](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L310)

## Type Parameters

### TFormData

`TFormData`

## Properties

### fields

```ts
fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>;
```

Defined in: [packages/form-core/src/validation.public.ts:312](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L312)

***

### form?

```ts
optional form: ValidationErrorInput;
```

Defined in: [packages/form-core/src/validation.public.ts:311](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L311)

***

### toResult()

```ts
toResult: () => 
  | ValidationAggregateError<TFormData>
  | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:313](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L313)

#### Returns

  \| [`ValidationAggregateError`](ValidationAggregateError.md)\<`TFormData`\>
  \| `undefined`
