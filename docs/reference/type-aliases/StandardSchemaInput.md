---
id: StandardSchemaInput
title: StandardSchemaInput
---

```ts
type StandardSchemaInput<TSchema> = TSchema extends StandardSchemaV1<infer TInput, any> ? TInput : never;
```

Defined in: [validation/results/standardSchema.public.ts:105](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/standardSchema.public.ts#L105)

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>
