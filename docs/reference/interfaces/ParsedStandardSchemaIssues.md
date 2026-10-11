---
id: ParsedStandardSchemaIssues
title: ParsedStandardSchemaIssues
---

Defined in: [validation.public.ts:637](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L637)

Standard Schema issues reported at form or group scope and routed to field paths.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### fields

```ts
fields: Partial<Record<DeepKeys<TFormData>, StandardSchemaV1Issue[]>>;
```

Defined in: [validation.public.ts:641](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L641)

Issues with paths, grouped by field path relative to the validator's value.

***

### form

```ts
form: StandardSchemaV1Issue[];
```

Defined in: [validation.public.ts:639](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L639)

All supplied issues, including those with field paths.
