---
id: ParsedStandardSchemaIssues
title: ParsedStandardSchemaIssues
---

Defined in: [validation/results/results.public.ts:115](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L115)

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

Defined in: [validation/results/results.public.ts:122](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L122)

***

### fields

```ts
fields: ValidationFieldMap<TFormData, TFieldError>;
```

Defined in: [validation/results/results.public.ts:63](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L63)

#### Inherited from

```ts
Required.fields
```

***

### form

```ts
form: StandardSchemaV1Issue[];
```

Defined in: [validation/results/results.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L62)

#### Inherited from

```ts
Required.form
```
