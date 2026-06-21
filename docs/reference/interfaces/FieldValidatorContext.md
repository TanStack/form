---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [validation.public.ts:381](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L381)

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

Defined in: [validation.public.ts:386](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L386)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, any, TFormData, any, any>;
```

Defined in: [validation.public.ts:389](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L389)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [validation.public.ts:388](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L388)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [validation.public.ts:391](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L391)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:387](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L387)

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:390](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L390)
