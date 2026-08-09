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

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: {
      people: [{ id: crypto.randomUUID(), name: '', age: 0 }],
    },
    onSubmit: ({ value }) => console.log(value),
  }))
</script>

<form
  onsubmit={(event) => {
    event.preventDefault()
    form.handleSubmit()
  }}
>
  <form.ArrayField name="people">
    {#snippet children(array)}
      <ul>
        {#each array.value as person, index (person.id)}
          <li>
            <form.Field name={`people[${index}].name`}>
              {#snippet children(field)}
                <label>
                  Name
                  <input
                    name={field.name}
                    value={field.value}
                    onblur={field.handleBlur}
                    oninput={(event) =>
                      field.handleChange(event.currentTarget.value)}
                  />
                </label>
              {/snippet}
            </form.Field>

            <form.Field name={`people[${index}].age`}>
              {#snippet children(field)}
                <label>
                  Age
                  <input
                    name={field.name}
                    type="number"
                    value={field.value}
                    oninput={(event) =>
                      field.handleChange(event.currentTarget.valueAsNumber)}
                  />
                </label>
              {/snippet}
            </form.Field>

            <button
              type="button"
              onclick={() => form.removeFieldValue('people', index)}
            >
              Remove person
            </button>
          </li>
        {/each}
      </ul>
    {/snippet}
  </form.ArrayField>

  <button
    type="button"
    onclick={() =>
      form.pushFieldValue('people', {
        id: crypto.randomUUID(),
        name: '',
        age: 0,
      })}
  >
    Add person
  </button>
  <button type="submit">Submit</button>
</form>
```

## Array mutations

The form API exposes typed helpers for common operations:

```svelte
<script lang="ts">
  form.pushFieldValue('people', {
    id: crypto.randomUUID(),
    name: '',
    age: 0,
  })
  form.insertFieldValue('people', 1, {
    id: crypto.randomUUID(),
    name: '',
    age: 0,
  })
  form.removeFieldValue('people', 0)
  form.swapFieldValues('people', 0, 1)
  form.moveFieldValue('people', 2, 0)
  form.filterFieldValues('people', (person) => person.age >= 18)
  form.clearFieldValues('people')
</script>
```

Use a stable item identifier as the keyed each-block key when items can be
reordered. An index key is sufficient only when item identity does not matter.
