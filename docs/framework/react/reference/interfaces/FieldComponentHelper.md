---
id: FieldComponentHelper
title: FieldComponentHelper
---

# Interface: FieldComponentHelper

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:68](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L68)

Wraps components that accept a field API prop so App Form can supply that
prop from field context.

## Properties

### loose

```ts
loose: <TComponent, TProps, TFieldPropKey>(Component, fieldPropKey) => LooseInjectedFieldComponent<TComponent, TProps, TFieldPropKey>;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:147](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L147)

Wraps a component for fields whose value type is assignable to the value
type accepted by its field API prop.

The returned component omits `fieldPropKey` from its public props and reads
that field API from the nearest App Form field context. Use this mode for a
component that intentionally supports a broader range of field values.

#### Type Parameters

##### TComponent

`TComponent` *extends* `AnyFieldComponent`

Library-managed. Do not specify explicitly.

##### TProps

`TProps` = `PropsOf`\<`TComponent`\>

Library-managed. Do not specify explicitly.

##### TFieldPropKey

`TFieldPropKey` *extends* `string` \| `number` \| `symbol` = `FieldValuePropKeys`\<`TProps`\>

Library-managed. Do not specify explicitly.

#### Parameters

##### Component

`TComponent`

The component whose field API prop should be injected.

##### fieldPropKey

`TFieldPropKey`

The prop that accepts the current field API.

#### Returns

`LooseInjectedFieldComponent`\<`TComponent`, `TProps`, `TFieldPropKey`\>

#### Example

```tsx
import { getFormHookHelpers } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'

function FieldErrors({ field }: { field: AnyFieldApi }) {
  return <span>{field.errors.map((error) => error.message).join(', ')}</span>
}

const { fieldComponent } = getFormHookHelpers()
const Errors = fieldComponent.loose(FieldErrors, 'field')
```

***

### strict

```ts
strict: <TComponent, TProps, TFieldPropKey>(Component, fieldPropKey) => StrictInjectedFieldComponent<TComponent, TProps, TFieldPropKey>;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:110](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L110)

Wraps a component for fields whose value type exactly matches the value
type of its field API prop.

The returned component omits `fieldPropKey` from its public props and reads
that field API from the nearest App Form field context. It must be rendered
beneath an App Form `Field` or field-group `Field` component.

#### Type Parameters

##### TComponent

`TComponent` *extends* `AnyFieldComponent`

Library-managed. Do not specify explicitly.

##### TProps

`TProps` = `PropsOf`\<`TComponent`\>

Library-managed. Do not specify explicitly.

##### TFieldPropKey

`TFieldPropKey` *extends* `string` \| `number` \| `symbol` = `FieldValuePropKeys`\<`TProps`\>

Library-managed. Do not specify explicitly.

#### Parameters

##### Component

`TComponent`

The component whose field API prop should be injected.

##### fieldPropKey

`TFieldPropKey`

The prop that accepts the current field API.

#### Returns

`StrictInjectedFieldComponent`\<`TComponent`, `TProps`, `TFieldPropKey`\>

#### Example

```tsx
import { getFormHookHelpers } from '@tanstack/react-form'
import type { FieldWithValue } from '@tanstack/react-form'

function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        value={field.value}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </label>
  )
}

const { fieldComponent } = getFormHookHelpers()
const TextField = fieldComponent.strict(TextInput, 'field')
```
