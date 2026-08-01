---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:460](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L460)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:468](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L468)

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

Defined in: [packages/form-core/src/validation.public.ts:461](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L461)

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:463](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L463)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:464](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L464)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:467](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L467)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:462](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L462)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:465](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L465)

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:466](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L466)
