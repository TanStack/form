---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

Defined in: [pipeline/validation/validation.public.ts:512](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L512)

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

Defined in: [pipeline/validation/validation.public.ts:526](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L526)

Builds a mutable error map from optional group errors and errors at group-relative field paths.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [pipeline/validation/validation.public.ts:530](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L530)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: "mount" | ValidationTrigger;
```

Defined in: [pipeline/validation/validation.public.ts:514](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L514)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [pipeline/validation/validation.public.ts:518](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L518)

The owning form, including values outside this group.

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [pipeline/validation/validation.public.ts:520](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L520)

The group whose value is being validated.

***

### parseIssues

```ts
parseIssues: ParseIssuesFn<TGroupValue>;
```

Defined in: [pipeline/validation/validation.public.ts:528](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L528)

Converts Standard Schema issues into a mutable error map using the group's values and field paths.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [pipeline/validation/validation.public.ts:516](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L516)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/validation.public.ts:522](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L522)

The field that caused validation, when available.

***

### value

```ts
value: TGroupValue;
```

Defined in: [pipeline/validation/validation.public.ts:524](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L524)

The group's current value, without the surrounding form values.
