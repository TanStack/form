---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [validation.public.ts:488](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L488)

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

Defined in: [validation.public.ts:493](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L493)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [validation.public.ts:496](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L496)

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation.public.ts:495](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L495)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [validation.public.ts:498](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L498)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:494](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L494)

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:497](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L497)
