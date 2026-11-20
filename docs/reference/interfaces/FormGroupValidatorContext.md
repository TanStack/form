---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

Defined in: [validation.public.ts:584](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L584)

Values and helpers passed to a form group validation function.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateErrorMapFn<TGroupValue>;
```

Defined in: [validation.public.ts:598](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L598)

Builds a mutable error map from optional group errors and errors at group-relative field paths.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [validation.public.ts:602](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L602)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: "mount" | ValidationTrigger;
```

Defined in: [validation.public.ts:586](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L586)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:590](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L590)

The owning form, including values outside this group.

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:592](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L592)

The group whose value is being validated.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TGroupValue>;
```

Defined in: [validation.public.ts:600](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L600)

Converts Standard Schema issues into a mutable error map using the group's values and field paths.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:588](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L588)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:594](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L594)

The field that caused validation, when available.

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:596](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L596)

The group's current value, without the surrounding form values.
