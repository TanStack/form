---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [validation.public.ts:337](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L337)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### event

```ts
event: ValidationTrigger;
```

Defined in: [validation.public.ts:338](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L338)

***

### formApi

```ts
formApi: FormApi<any, any, any>;
```

Defined in: [validation.public.ts:340](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L340)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>;
```

Defined in: [validation.public.ts:341](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L341)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [validation.public.ts:344](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L344)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:339](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L339)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:342](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L342)

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:343](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L343)
