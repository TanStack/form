---
id: ParsedStandardSchemaIssues
title: ParsedStandardSchemaIssues
---

Defined in: [validation/state.public.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L88)

## Extends

- `Required`\<[`ValidationErrorMap`](ValidationErrorMap.md)\<`TFormData`, [`StandardSchemaV1Issue`](StandardSchemaV1Issue.md)[], [`StandardSchemaV1Issue`](StandardSchemaV1Issue.md)[]\>\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### \[PARSED\_ISSUES\]

```ts
readonly [PARSED_ISSUES]: true;
```

Defined in: [validation/state.public.ts:95](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L95)

***

### fields

```ts
fields: ValidationFieldMap<TFormData, TFieldError>;
```

Defined in: [validation/state.public.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L67)

#### Inherited from

```ts
Required.fields
```

***

### form

```ts
form: StandardSchemaV1Issue[];
```

Defined in: [validation/state.public.ts:66](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L66)

#### Inherited from

```ts
Required.form
```
