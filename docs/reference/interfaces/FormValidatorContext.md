---
id: FormValidatorContext
title: FormValidatorContext
---

# Interface: FormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:412](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L412)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:419](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L419)

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

Defined in: [packages/form-core/src/validation.public.ts:413](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L413)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:415](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L415)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:418](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L418)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:414](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L414)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:416](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L416)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:417](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L417)
