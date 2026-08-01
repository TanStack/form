---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

# Interface: ServerFormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:409](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L409)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:416](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L416)

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

Defined in: [packages/form-core/src/validation.public.ts:410](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L410)

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:412](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L412)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:415](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L415)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:411](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L411)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:413](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L413)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:414](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L414)
