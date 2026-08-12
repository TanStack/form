---
id: Editable
title: Editable
---

# Type Alias: Editable\<T\>

```ts
type Editable<T> = T extends BuiltInType ? T | null | undefined : T extends ReadonlyArray<unknown> ? Editable<T[number]>[] | null | undefined : T extends object ? EditableObject<T> | null | undefined : T | null | undefined;
```

Defined in: [utils.public.ts:8](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/utils.public.ts#L8)

## Type Parameters

### T

`T`
