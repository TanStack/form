---
id: InferOutput
title: InferOutput
---

# Type Alias: InferOutput\<Schema\>

```ts
type InferOutput<Schema>: NonNullable<Schema["~standard"]["types"]>["output"];
```

Infers the output type of a Standard Schema.

## Type Parameters

• **Schema** *extends* `StandardSchemaV1`

## Defined in

[packages/form-core/src/standardSchemaValidator.ts:193](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L193)
