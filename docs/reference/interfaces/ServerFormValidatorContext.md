---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

# Interface: ServerFormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:387](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L387)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:394](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L394)

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [packages/form-core/src/validation.public.ts:388](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L388)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:390](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L390)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:393](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L393)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:389](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L389)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:391](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L391)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:392](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L392)
