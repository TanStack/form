---
id: arrays
title: Arrays
---

TanStack Form supports arrays as form values, including objects and nested fields inside an array. In TSRX, render array fields with a keyed `@for` loop.

## Basic Usage

Use `mode="array"` to manage the array and read its entries through `field.state.value`. Give an initially empty array a type so that field paths and new entries can be inferred:

```tsrx
import { useForm } from '@tanstack/octane-form'

type Person = {
  id: string;
  name: string;
  age: number;
}

function App() @{
  const form = useForm({
    defaultValues: {
      people: [] as Person[],
    },
  })

  <form.Field
    name="people"
    mode="array"
    children={(field) => <div>
      @for (const person of field.state.value; index i; key person.id) {
        <p>Person {i + 1}: {person.id}</p>
      }
    </div>}
  />
}
```

Call `pushValue` to add an entry. The array field updates and the loop renders the new row:

```tsrx
<button
  onClick={() => field.pushValue({
    id: crypto.randomUUID(),
    name: '',
    age: 0,
  })}
  type="button"
>
  Add person
</button>
```

Access an entry's nested fields using an indexed path:

```tsrx
<form.Field
  name={`people[${i}].name`}
  children={(subField) =>
    <input
      value={subField.state.value}
      onInput={(event) => subField.handleChange(event.currentTarget.value)}
      onBlur={subField.handleBlur}
    />}
/>
```

The loop's `key` identifies the row, while the field's `name` identifies its current position in the form. Use a stable key when rows can be removed or reordered, so Octane can preserve each row's DOM and component state. Native text inputs use `onInput` to update on each edit.

## Full Example

Save components that render templates in `.tsrx` files:

```tsrx
// src/App.tsrx
import { useForm } from '@tanstack/octane-form'

type Person = {
  id: string;
  name: string;
  age: number;
}

export function App() @{
  const form = useForm({
    defaultValues: {
      people: [] as Person[],
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value))
    },
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <form.Field
      name="people"
      mode="array"
      children={(field) => <div>
        @for (const person of field.state.value; index i; key person.id) {
          <div>
            <form.Field
              name={`people[${i}].name`}
              children={(subField) => <label>
                <span>Name for person {i + 1}</span>
                <input
                  value={subField.state.value}
                  onInput={(event) => subField.handleChange(
                    event.currentTarget.value,
                  )}
                  onBlur={subField.handleBlur}
                />
              </label>}
            />
            <button type="button" onClick={() => field.removeValue(i)}>
              Remove person
            </button>
          </div>
        }
        <button
          type="button"
          onClick={() => field.pushValue({
            id: crypto.randomUUID(),
            name: '',
            age: 0,
          })}
        >
          Add person
        </button>
      </div>}
    />
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => <button
        type="submit"
        disabled={!canSubmit}
      >
        @if (isSubmitting) {
          <>...</>
        } @else {
          <>Submit</>
        }
      </button>}
    />
  </form>
}
```
