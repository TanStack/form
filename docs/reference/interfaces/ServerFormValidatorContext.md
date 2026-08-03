---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

# Interface: ServerFormValidatorContext\<TFormData\>

Defined in: [validation.public.ts:407](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L407)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap()

```ts
createErrorMap: (initial?) => ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:414](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L414)

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

Defined in: [validation.public.ts:408](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L408)

***

### formApi

```ts
formApi: FormApi<TFormData, any> | undefined;
```

Defined in: [validation.public.ts:410](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L410)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:413](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L413)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:409](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L409)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:411](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L411)

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:412](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L412)
