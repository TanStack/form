---
id: ServerFormValidatorContext
title: ServerFormValidatorContext
---

# Interface: ServerFormValidatorContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:459](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L459)

## Type Parameters

### TFormData

`TFormData`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:466](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L466)

***

### event

```ts
event: ValidationTrigger | "server";
```

Defined in: [packages/form-core/src/validation.public.ts:460](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L460)

***

### formApi

```ts
formApi: FormApi<TFormData, any, any> | undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:462](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L462)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:465](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L465)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:461](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L461)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:463](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L463)

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:464](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L464)
