---
id: CompatibleFormComponents
title: CompatibleFormComponents
---

```ts
type CompatibleFormComponents<TComponents, TFormComponents, TFieldComponents> = { [K in keyof TComponents]: CompatibleFormComponent<TComponents[K], TFormComponents, TFieldComponents> };
```

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:82](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L82)

## Type Parameters

### TComponents

`TComponents`

### TFormComponents

`TFormComponents` *extends* [`ReactFormComponents`](ReactFormComponents.md)

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)
