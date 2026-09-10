---
id: FieldBrandHelper
title: FieldBrandHelper
---

# Interface: FieldBrandHelper

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:162](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L162)

Adds field-value compatibility metadata to components without wrapping them
or changing their runtime props.

## Properties

### loose

```ts
loose: <TValue>() => <TComponent>(Component) => LooseBrandedFieldComponent<TComponent, TValue>;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:210](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L210)

Brands a component for fields whose value type is assignable to
`TValue`.

The returned value is the original component at runtime. Unlike
`fieldComponent.loose`, this helper does not inject a field API prop.

#### Type Parameters

##### TValue

`TValue`

The field value type accepted by the component.

#### Returns

\<`TComponent`\>(`Component`) => `LooseBrandedFieldComponent`\<`TComponent`, `TValue`\>

#### Example

```tsx
import { getFormHookHelpers } from '@tanstack/react-form'

function FieldDescription() {
  return <span>Changes are saved automatically.</span>
}

const { fieldBrand } = getFormHookHelpers()
const Description = fieldBrand.loose<unknown>()(FieldDescription)
```

***

### strict

```ts
strict: <TValue>() => <TComponent>(Component) => StrictBrandedFieldComponent<TComponent, TValue>;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:184](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L184)

Brands a component for fields whose value type exactly matches `TValue`.

The returned value is the original component at runtime. Unlike
`fieldComponent.strict`, this helper does not inject a field API prop.

#### Type Parameters

##### TValue

`TValue`

The exact field value type that exposes the component.

#### Returns

\<`TComponent`\>(`Component`) => `StrictBrandedFieldComponent`\<`TComponent`, `TValue`\>

#### Example

```tsx
import { getFormHookHelpers } from '@tanstack/react-form'

function Adornment() {
  return <span>Required</span>
}

const { fieldBrand } = getFormHookHelpers()
const StringAdornment = fieldBrand.strict<string>()(Adornment)
```
