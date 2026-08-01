---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:520](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L520)

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

Defined in: [packages/form-core/src/validation.public.ts:525](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L525)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, any, TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:528](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L528)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:527](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L527)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [packages/form-core/src/validation.public.ts:530](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L530)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:526](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L526)

***

### value

```ts
value: TFieldValue;
```

Defined in: [packages/form-core/src/validation.public.ts:529](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L529)
