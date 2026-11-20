---
id: Editable
title: Editable
---

```ts
type Editable<T> = T extends BuiltInType ? T | null | undefined : T extends ReadonlyArray<unknown> ? ReadonlyArray<Editable<T[number]>> | null | undefined : T extends object ? EditableObject<T> | null | undefined : T | null | undefined;
```

Defined in: [utils.public.ts:5](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L5)

## Type Parameters

### T

`T`
