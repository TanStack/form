---
id: arrays
title: Arrays
---

TanStack Form supports arrays of simple values and objects. When you want to
treat the entire array as one field value, using `form.Field` is valid.

However, when each item is rendered as a separate field, wrapping the array in
`form.Field` means that a change to a nested field can update the whole list.

## Render an array

Use `form.ArrayField` when each item in an array is rendered as its own field.
It updates the list when its structure changes, such as when an item is added,
removed, or reordered, while nested `form.Field` components subscribe to their
own values.

```tsx
import { For } from 'solid-js'
import { createForm } from '@tanstack/solid-form'

export function PeopleForm() {
  const form = createForm(() => ({
    defaultValues: {
      people: [{ name: '', age: 0 }],
    },
    onSubmit: ({ value }) => console.log(value),
  }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.ArrayField name="people">
        {(array) => (
          <ul>
            <For each={array().value}>
              {(_person, index) => (
                <li>
                  <form.Field name={`people[${index()}].name`}>
                    {(field) => (
                      <label>
                        Name
                        <input
                          name={field().name}
                          value={field().value}
                          onBlur={field().handleBlur}
                          onInput={(event) =>
                            field().handleChange(event.currentTarget.value)
                          }
                        />
                      </label>
                    )}
                  </form.Field>

                  <form.Field name={`people[${index()}].age`}>
                    {(field) => (
                      <label>
                        Age
                        <input
                          name={field().name}
                          type="number"
                          value={field().value}
                          onInput={(event) =>
                            field().handleChange(
                              event.currentTarget.valueAsNumber,
                            )
                          }
                        />
                      </label>
                    )}
                  </form.Field>

                  <button
                    type="button"
                    onClick={() => form.removeFieldValue('people', index())}
                  >
                    Remove person
                  </button>
                </li>
              )}
            </For>
          </ul>
        )}
      </form.ArrayField>

      <button
        type="button"
        onClick={() =>
          form.pushFieldValue('people', {
            name: '',
            age: 0,
          })
        }
      >
        Add person
      </button>
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Array mutations

The form API exposes typed helpers for common operations:

```ts
form.pushFieldValue('people', {
  name: '',
  age: 0,
})
form.insertFieldValue('people', 1, {
  name: '',
  age: 0,
})
form.removeFieldValue('people', 0)
form.swapFieldValues('people', 0, 1)
form.moveFieldValue('people', 2, 0)
form.filterFieldValues('people', (person) => person.age >= 18)
form.clearFieldValues('people')
```

Solid's `For` component preserves each item by object identity. Keep those
identities stable when reordering, and include application-level IDs when
reconciling fresh objects from an external source.
