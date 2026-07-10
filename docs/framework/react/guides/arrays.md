---
id: arrays
title: Arrays
---

TanStack Form supports arrays of scalar values and objects. Use
`form.ArrayField` at the list boundary, regular `form.Field` components for
item values, and form-level methods for mutations.

## Render an array

`ArrayField` subscribes to structural changes such as insertion, removal, and
reordering. Editing one item can then rerender its `Field` without rerendering
the entire list.

```tsx
import { useForm } from '@tanstack/react-form'

function PeopleForm() {
  const form = useForm({
    defaultValues: {
      people: [{ name: '', age: 0 }],
    },
    onSubmit: ({ value }) => console.log(value),
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.ArrayField name="people">
        {(array) => (
          <ul>
            {array.value.map((_, index) => (
              <li key={index}>
                <form.Field name={`people[${index}].name`}>
                  {(field) => (
                    <label>
                      Name
                      <input
                        name={field.name}
                        value={field.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </label>
                  )}
                </form.Field>

                <form.Field name={`people[${index}].age`}>
                  {(field) => (
                    <label>
                      Age
                      <input
                        name={field.name}
                        type="number"
                        value={field.value}
                        onChange={(event) =>
                          field.handleChange(event.target.valueAsNumber)
                        }
                      />
                    </label>
                  )}
                </form.Field>

                <button
                  type="button"
                  onClick={() => form.removeFieldValue('people', index)}
                >
                  Remove person
                </button>
              </li>
            ))}
          </ul>
        )}
      </form.ArrayField>

      <button
        type="button"
        onClick={() => form.pushFieldValue('people', { name: '', age: 0 })}
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

```tsx
form.pushFieldValue('people', { name: '', age: 0 })
form.insertFieldValue('people', 1, { name: '', age: 0 })
form.removeFieldValue('people', 0)
form.swapFieldValues('people', 0, 1)
form.moveFieldValue('people', 2, 0)
form.filterFieldValues('people', (person) => person.age >= 18)
form.clearFieldValues('people')
```

Prefer a stable item identifier for the React `key` when items can be reordered.
An index key is sufficient only when item identity does not matter.
