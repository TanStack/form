---
id: FormValidatorContext
title: FormValidatorContext
---

# Interface: FormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:449](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L449)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:456](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L456)

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [packages/form-core/src/validation.public.ts:450](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L450)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:452](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L452)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:455](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L455)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:451](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L451)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:453](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L453)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:454](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L454)
