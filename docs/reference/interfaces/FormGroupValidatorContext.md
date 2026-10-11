---
id: FormGroupValidatorContext
title: FormGroupValidatorContext
---

Defined in: [validation.public.ts:867](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L867)

Values and helpers passed to a form group validation function.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: (initial?) => ValidationErrorMap<TGroupValue>;
```

Defined in: [validation.public.ts:883](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L883)

Creates an error map whose field paths are relative to this group.

Creates a mutable map of form errors and errors for individual field paths.

Pass the completed map back from a form or group validator to report the errors.

#### Parameters

##### initial?

`Partial`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TGroupValue`\>\>

An existing map to reuse. A missing `fields` object is added to it.

#### Returns

[`ValidationErrorMap`](ValidationErrorMap.md)\<`TGroupValue`\>

The initial map, if supplied, or a new map with an empty `fields` object.

***

### createOutput

```ts
createOutput: CreateOutputFn;
```

Defined in: [validation.public.ts:885](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L885)

Creates a successful result to return data in this validator's `validatorOutputs` entry.

***

### event

```ts
event: ValidationTrigger;
```

Defined in: [validation.public.ts:869](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L869)

The event that caused this validation run.

***

### formApi

```ts
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:873](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L873)

The owning form, including values outside this group.

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:875](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L875)

The group whose value is being validated.

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TGroupValue>;
```

Defined in: [validation.public.ts:881](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L881)

Converts Standard Schema issues into group errors and errors at group-relative field paths.

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:871](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L871)

Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [validation.public.ts:877](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L877)

The field that caused validation, when available.

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:879](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L879)

The group's current value, without the surrounding form values.
