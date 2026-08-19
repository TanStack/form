---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

# Interface: ServerFormValidatorContext\<TFormData\>

Defined in: [validation.public.ts:422](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L422)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:429](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L429)

Creates a mutable validation error map.

If an initial error map is provided, the same object is returned.

#### Parameters

##### initial?

`Partial`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`\>\>

#### Returns

[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`\>

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [validation.public.ts:423](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L423)

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:425](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L425)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:428](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L428)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:424](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L424)

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L426)

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:427](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L427)
