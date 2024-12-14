---
id: InferInput
title: InferInput
---

# Type Alias: InferInput\<Schema\>

```ts
type InferInput<Schema>: NonNullable<Schema["~standard"]["types"]>["input"];
```

Infers the input type of a Standard Schema.

## Type Parameters

• **Schema** *extends* `StandardSchemaV1`

## Defined in

[packages/form-core/src/standardSchemaValidator.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L187)
