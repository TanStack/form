---
id: FormValidatorContext
title: FormValidatorContext
---

# Interface: FormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:377](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L377)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:384](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L384)

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [packages/form-core/src/validation.public.ts:378](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L378)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:380](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L380)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:383](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L383)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:379](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L379)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:381](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L381)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:382](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L382)
