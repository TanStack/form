---
id: FormValidatorContext
title: FormValidatorContext
---

# Interface: FormValidatorContext\<TFormData\>

Defined in: [validation.public.ts:298](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L298)

## Extends

- `BaseValidatorContext`\<`TFormData`\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### event

```ts
event: ValidationTrigger;
```

Defined in: [validation.public.ts:293](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L293)

#### Inherited from

```ts
BaseValidatorContext.event
```

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [validation.public.ts:295](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L295)

#### Inherited from

```ts
BaseValidatorContext.formApi
```

***

### parseIssues

```ts
parseIssues: ParseFormIssuesFn<TFormData>;
```

Defined in: [validation.public.ts:303](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L303)

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [validation.public.ts:294](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L294)

#### Inherited from

```ts
BaseValidatorContext.signal
```

***

### triggerFieldApi?

```ts
optional triggerFieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:301](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L301)

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:302](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L302)
