---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [validation.public.ts:470](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L470)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap

```ts
createErrorMap: (initial?) => ValidationErrorMap<TGroupValue>;
```

Defined in: [validation.public.ts:478](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L478)

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

Defined in: [validation.public.ts:471](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L471)

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:473](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L473)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:474](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L474)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [validation.public.ts:477](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L477)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:472](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L472)

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:475](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L475)

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:476](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L476)
