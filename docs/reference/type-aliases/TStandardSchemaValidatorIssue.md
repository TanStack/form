---
id: TStandardSchemaValidatorIssue
title: TStandardSchemaValidatorIssue
---

# Type Alias: TStandardSchemaValidatorIssue\<TSource\>

```ts
type TStandardSchemaValidatorIssue<TSource> = TSource extends "form" ? object : TSource extends "field" ? StandardSchemaV1Issue[] : never;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:11](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L11)

## Type Parameters

### TSource

`TSource` *extends* [`ValidationSource`](ValidationSource.md) = [`ValidationSource`](ValidationSource.md)
