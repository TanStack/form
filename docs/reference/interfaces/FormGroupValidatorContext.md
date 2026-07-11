---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

# Interface: FormGroupValidatorContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:510](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L510)

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:518](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L518)

***

### event

```ts
event: ValidationTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:511](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L511)

***

### formApi

```ts
formApi: FormApi<any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:513](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L513)

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:514](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L514)

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:517](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L517)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [packages/form-core/src/validation.public.ts:512](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L512)

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:515](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L515)

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:516](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L516)
