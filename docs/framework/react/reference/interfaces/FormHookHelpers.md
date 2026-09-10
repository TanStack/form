---
id: FormHookHelpers
title: FormHookHelpers
---

# Interface: FormHookHelpers

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:230](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L230)

Helpers for preparing value-compatible field components for registration
with `createFormHook`.

Use `fieldComponent` when the current field API should be injected into a
component prop. Use `fieldBrand` when the component should retain its
original runtime props.

## Example

```tsx
import { getFormHookHelpers } from '@tanstack/react-form'

const { fieldBrand, fieldComponent } = getFormHookHelpers()
```

## Properties

### fieldBrand

```ts
fieldBrand: FieldBrandHelper;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:232](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L232)

Brands components without wrapping them or injecting a field API prop.

***

### fieldComponent

```ts
fieldComponent: FieldComponentHelper;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:234](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L234)

Wraps components and injects the current field API into a selected prop.
