---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:482](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L482)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFormData

`TFormData`

## Properties

### event

```ts
event: ValidationTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:487](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L487)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, any, TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:490](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L490)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:489](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L489)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [packages/form-core/src/validation.public.ts:492](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L492)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:488](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L488)

***

### value

```ts
value: TFieldValue;
```

Defined in: [packages/form-core/src/validation.public.ts:491](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L491)
