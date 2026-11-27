---
id: ValidatorPredicateContext
title: ValidatorPredicateContext
---

Defined in: [pipeline/validation/formValidators.public.ts:230](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L230)

Current form state passed to `when` and `skipOnSubmit` callbacks.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Properties

### fieldApi?

```ts
optional fieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/formValidators.public.ts:242](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L242)

The field that triggered validation. `undefined` when no field triggered
the run.

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [pipeline/validation/formValidators.public.ts:237](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L237)

The owning form calling this function.

***

### scope

```ts
scope: "form";
```

Defined in: [pipeline/validation/formValidators.public.ts:235](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L235)

Identifies a form validator in predicates shared with field or form group
validators. Remains `'form'` when a field change or blur triggers validation.

***

### value

```ts
value: TValue;
```

Defined in: [pipeline/validation/formValidators.public.ts:246](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L246)

The current value when the condition is evaluated.
