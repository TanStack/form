---
id: FormValidatorContext
title: FormValidatorContext
---

# Interface: FormValidatorContext\<TFormData\>

Defined in: [validation.public.ts:397](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L397)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:404](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L404)

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

Defined in: [validation.public.ts:398](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L398)

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:400](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L400)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:403](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L403)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:399](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L399)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:401](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L401)

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:402](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L402)
