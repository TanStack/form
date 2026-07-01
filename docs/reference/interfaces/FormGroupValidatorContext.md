---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:436](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L436)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:444](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L444)

***

### event

```ts
event: ValidationTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:437](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L437)

***

### formApi

```ts
formApi: FormApi<any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:439](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L439)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:440](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L440)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:443](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L443)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:438](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L438)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:441](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L441)

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:442](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L442)
