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

• **Schema** *extends* [`StandardSchemaV1`](../../../type-aliases/standardschemav1.md)

## Defined in

node\_modules/.pnpm/@standard-schema+spec@1.0.0-beta.4/node\_modules/@standard-schema/spec/dist/index.d.ts:100
