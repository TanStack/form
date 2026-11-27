---
id: BoundFormComponents
title: BoundFormComponents
---

```ts
type BoundFormComponents<TComponents> = { [K in keyof TComponents]: BoundFormComponent<TComponents[K]> };
```

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:45](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L45)

## Type Parameters

### TComponents

`TComponents` *extends* [`ReactFormComponents`](ReactFormComponents.md)
