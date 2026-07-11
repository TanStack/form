---
id: ParseFormIssuesFn
title: ParseFormIssuesFn
---

# Type Alias: ParseFormIssuesFn()\<TFormData\>

```ts
type ParseFormIssuesFn<TFormData> = (issues) => ParsedStandardSchemaIssues<TFormData>;
```

Defined in: [packages/form-core/src/validation.public.ts:445](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L445)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>
