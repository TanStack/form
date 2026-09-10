---
id: FieldValidatorContext
title: FieldValidatorContext
---

# Interface: FieldValidatorContext\<TFieldName, TFieldValue, TFormData\>

Defined in: [validation.public.ts:503](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L503)

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

Defined in: [validation.public.ts:508](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L508)

***

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>;
```

Defined in: [validation.public.ts:511](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L511)

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [validation.public.ts:510](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L510)

***

### parseIssues

```ts
parseIssues: ParseFieldIssuesFn;
```

Defined in: [validation.public.ts:513](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L513)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:509](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L509)

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:512](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L512)
