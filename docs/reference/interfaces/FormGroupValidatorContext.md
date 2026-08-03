---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [validation.public.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L455)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TGroupValue>;
```

Defined in: [validation.public.ts:463](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L463)

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

Defined in: [validation.public.ts:456](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L456)

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:458](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L458)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:459](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L459)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [validation.public.ts:462](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L462)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:457](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L457)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:460](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L460)

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:461](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L461)
