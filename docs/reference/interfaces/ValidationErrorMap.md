---
id: ValidationErrorMap
title: ValidationErrorMap
---

# Interface: ValidationErrorMap\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:382](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L382)

## Type Parameters

### TFormData

`TFormData`

## Properties

### fields

```ts
fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>;
```

Defined in: [packages/form-core/src/validation.public.ts:384](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L384)

***

### form?

```ts
optional form: ValidationErrorInput;
```

Defined in: [packages/form-core/src/validation.public.ts:383](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L383)

***

### toResult()

```ts
toResult: () => 
  | ValidationAggregateError<TFormData>
  | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:385](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L385)

#### Returns

  \| [`ValidationAggregateError`](ValidationAggregateError.md)\<`TFormData`\>
  \| `undefined`
