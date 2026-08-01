---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:473](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L473)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:481](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L481)

Creates a mutable validation error map.

If an initial error map is provided, the same object is returned.

#### Parameters

##### initial?

`Partial`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TGroupValue`\>\>

#### Returns

[`ValidationErrorMap`](ValidationErrorMap.md)\<`TGroupValue`\>

***

### event

```ts
event: ValidationTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:474](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L474)

***

### formApi

```ts
formApi: FormApi<any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:476](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L476)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:477](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L477)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:480](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L480)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:475](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L475)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:478](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L478)

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:479](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L479)
