---
id: getFormHookHelpers
title: getFormHookHelpers
---

# Function: getFormHookHelpers()

```ts
function getFormHookHelpers(): FormHookHelpers;
```

Defined in: [packages/react-form/src/AppForm/getFormHookHelpers.public.ts:268](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/getFormHookHelpers.public.ts#L268)

Creates helpers that make React field components value-aware for
`createFormHook`.

`fieldComponent` injects the current App Form field API into a selected prop.
`fieldBrand` only adds compile-time field-value compatibility and returns the
original component at runtime.

## Returns

[`FormHookHelpers`](../interfaces/FormHookHelpers.md)

## Example

```tsx
import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'
import type { FieldWithValue } from '@tanstack/react-form'

function TextInput({ field }: { field: FieldWithValue<string> }) {
  return (
    <input
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )
}

const { fieldComponent } = getFormHookHelpers()
const TextField = fieldComponent.strict(TextInput, 'field')

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: {},
})
```
