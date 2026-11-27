---
name: arrays
description: Use when rendering editable lists in React TanStack Form, adding or
  reordering rows, choosing Field versus ArrayField, or displaying array errors
  and meta state.
metadata:
  purpose: Render editable React lists and change their structure while retaining item identity and field state.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:docs/arrays.md
  - TanStack/form:packages/react-form/src/ReactForm/Components.public.ts
  - TanStack/form:packages/react-form/tests/public/array-field-subscriptions/*
  - TanStack/form:packages/form-core/src/FormApi/array-methods.lib.ts
  - TanStack/form:packages/form-core/tests/FormApi/array-methods.lib.spec.ts
---

Choose whether one control edits the complete array or each item has its own fields. This workflow is self-contained; no other skill is required. Use the application's existing form hook, including `useAppForm` when registered controls are available.

## Choose Field or ArrayField

| Task                                                                    | Component                            | Change values with                                                                          |
| ----------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| One control edits an entire array, such as a multi-select or tag picker | `form.Field`                         | `field.handleChange(nextArray)`                                                             |
| Separate fields edit properties inside each row                         | `form.ArrayField` around item fields | Array mutation methods for structural edits; each item field's `handleChange` for its value |

`ArrayField` subscribes to structural changes without rerendering the list for every item value change. Do not use its render callback as a live preview of all item values. For a derived total or preview, read [subscriptions](../subscriptions/SKILL.md).

## Render rows with stable identity

```tsx
import { useForm } from '@tanstack/react-form'

type Person = { id: string; name: string }
const defaultValues: { people: Person[] } = {
  people: [
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
  ],
}

export function PeopleEditor() {
  const form = useForm({ defaultValues })
  return (
    <form.ArrayField name="people" subscribeToMeta>
      {(array) => (
        <section>
          {array.value.map((person, index) => (
            <div key={person.id}>
              <form.Field name={`people[${index}].name`}>
                {(field) => (
                  <label>
                    Name
                    <input
                      name={field.name}
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                    />
                  </label>
                )}
              </form.Field>
              <button type="button" onClick={() => array.removeValue(index)}>
                Remove {person.id}
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => array.moveValue(index, index - 1)}
              >
                Move {person.id} up
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              array.pushValue({
                id: crypto.randomUUID(),
                name: '',
              })
            }
          >
            Add person
          </button>
          <output aria-label="People edited">
            {String(array.meta.subfields.isSomeDirty)}
          </output>
          {array.errors.map((error) => (
            <p key={error.message} role="alert">
              {error.message}
            </p>
          ))}
        </section>
      )}
    </form.ArrayField>
  )
}
```

Use a persistent item identifier as the React key. Field names still use the current index, such as `people[0].name`. Do not replace the index in a field path with an item ID or generate keys during rendering.

`subscribeToMeta` defaults to `false`. Enable it when the array callback reads errors or meta flags, including subfield flags. It does not subscribe to every item value change. Omit it when only rendering the row structure.

## Use structural mutation methods

| Array field method           | Form method                             | Purpose             |
| ---------------------------- | --------------------------------------- | ------------------- |
| `pushValue(value)`           | `pushFieldValue(name, value)`           | Append              |
| `insertValue(index, value)`  | `insertFieldValue(name, index, value)`  | Insert              |
| `removeValue(index)`         | `removeFieldValue(name, index)`         | Remove              |
| `replaceValue(index, value)` | `replaceFieldValue(name, index, value)` | Replace one item    |
| `swapValues(a, b)`           | `swapFieldValues(name, a, b)`           | Exchange two items  |
| `moveValue(from, to)`        | `moveFieldValue(name, from, to)`        | Move one item       |
| `filterValues(predicate)`    | `filterFieldValues(name, predicate)`    | Keep matching items |
| `clearValues()`              | `clearFieldValues(name)`                | Remove all items    |

These methods also move or remove the registered item field state. Replacing an array through `handleChange` alone does not express those row operations. A successful structural mutation marks the array touched and dirty and causes validation by default.

Initialize array types explicitly when an empty array would infer too narrowly. Type the application defaults, as above; let the form hook infer its generic arguments.

## Common mistakes

- Do not use v1's `<form.Field mode="array">`; use `form.ArrayField` in v2.0.0-alpha.3.
- Do not use array indexes as React keys for object rows that can move or be removed. Keep the item ID stable while updating indexed field names.
- Do not sort or splice `array.value` in place. Use the structural methods so registered fields move with their items.
- Do not read item properties in the array callback and expect each edit to rerender it. Put the read in an item field or a dedicated subscription.
- Do not read array errors or meta in that callback without `subscribeToMeta` or a separate subscription.

The [array guide](https://github.com/TanStack/form/blob/main/docs/arrays.md), [public subscription props](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts), and [array subscription cases](https://github.com/TanStack/form/tree/main/packages/react-form/tests/public/array-field-subscriptions) establish these rules.

## Check row operations

Edit and blur a row, move it, and confirm its value and field state follow that item. Remove a row and confirm the remaining inputs point to the right paths. Add a row to an empty list. Verify array error and meta displays update when only metadata changes, and that any totals update on repeated item edits.
