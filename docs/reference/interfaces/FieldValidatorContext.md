---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:557](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L557)

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

Defined in: [packages/form-core/src/validation.public.ts:562](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L562)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, any, TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:565](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L565)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:564](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L564)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [packages/form-core/src/validation.public.ts:567](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L567)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:563](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L563)

***

### value

```ts
value: TFieldValue;
```

Defined in: [packages/form-core/src/validation.public.ts:566](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L566)
