---
id: arrays
title: Arrays
---

TanStack Form supports arrays of simple values and objects. Use
`form.field(...)` when the array should behave as one value. Use
`form.arrayField(...)` when each item is rendered as separate fields.

## Render an array

`form.arrayField(...)` updates its child part only when the array structure
changes, such as when an item is added, removed, or reordered. Editing a nested
field does not rerender the entire list.

```ts
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { TanStackFormController } from '@tanstack/lit-form'

class PeopleForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      people: [{ id: crypto.randomUUID(), name: '', age: 0 }],
    },
    onSubmit: ({ value }) => console.log(value),
  })

  render() {
    return html`
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.arrayField(
          { name: 'people' },
          (array) => html`
            <ul>
              ${repeat(
                array.value,
                (person) => person.id,
                (_person, index) => html`
                  <li>
                    ${this.form.field(
                      { name: `people[${index}].name` },
                      (field) => html`
                        <label>
                          Name
                          <input
                            name=${field.name}
                            .value=${field.value}
                            @blur=${() => field.handleBlur()}
                            @input=${(event: InputEvent) =>
                              field.handleChange(
                                (event.currentTarget as HTMLInputElement).value,
                              )}
                          />
                        </label>
                      `,
                    )}
                    ${this.form.field(
                      { name: `people[${index}].age` },
                      (field) => html`
                        <label>
                          Age
                          <input
                            name=${field.name}
                            type="number"
                            .value=${String(field.value)}
                            @input=${(event: InputEvent) =>
                              field.handleChange(
                                (event.currentTarget as HTMLInputElement)
                                  .valueAsNumber,
                              )}
                          />
                        </label>
                      `,
                    )}

                    <button
                      type="button"
                      @click=${() =>
                        this.form.api.removeFieldValue('people', index)}
                    >
                      Remove person
                    </button>
                  </li>
                `,
              )}
            </ul>
          `,
        )}

        <button
          type="button"
          @click=${() =>
            this.form.api.pushFieldValue('people', {
              id: crypto.randomUUID(),
              name: '',
              age: 0,
            })}
        >
          Add person
        </button>
        <button type="submit">Submit</button>
      </form>
    `
  }
}
```

Array mutations live on `form.api`, not on the array render value.

## Array mutations

The form API exposes typed helpers for common operations:

```ts
this.form.api.pushFieldValue('people', person)
this.form.api.insertFieldValue('people', 1, person)
this.form.api.removeFieldValue('people', 0)
this.form.api.swapFieldValues('people', 0, 1)
this.form.api.moveFieldValue('people', 2, 0)
this.form.api.filterFieldValues('people', (person) => person.age >= 18)
this.form.api.clearFieldValues('people')
```

When items can be reordered, use Lit's `repeat` directive with a stable item
identifier. An index key is sufficient only when item identity does not matter.
