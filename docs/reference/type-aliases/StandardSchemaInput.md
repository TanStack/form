---
id: StandardSchemaInput
title: StandardSchemaInput
---

```ts
type StandardSchemaInput<TSchema> = TSchema extends StandardSchemaV1<infer TInput, any> ? TInput : never;
```

Defined in: [standardSchema.public.ts:105](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchema.public.ts#L105)

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>
