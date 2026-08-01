---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [validation.public.ts:495](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L495)

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

Defined in: [validation.public.ts:500](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L500)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [validation.public.ts:503](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L503)

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation.public.ts:502](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L502)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [validation.public.ts:505](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L505)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:501](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L501)

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:504](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L504)
