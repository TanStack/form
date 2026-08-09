---
id: arrays
title: Arrays
---

TanStack Form supports arrays of simple values and objects. When you want to
treat the entire array as one field value, using `TanStackField` is valid.

However, when each item is rendered as a separate field, wrapping the array in
`TanStackField` means that a change to a nested field can update the whole
list.

## Render an array

Use `TanStackArrayField` when each item in an array is rendered as its own
field. It updates the list when its structure changes, such as when an item is
added, removed, or reordered, while nested `TanStackField` directives
subscribe to their own values.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackArrayField,
  TanStackField,
  injectForm,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-people-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackArrayField, TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <ng-container
        [tanstackArrayField]="form"
        name="people"
        #people="arrayField"
      >
        <ul>
          @for (
            person of people.api.value;
            track person.id;
            let index = $index
          ) {
            <li>
              <ng-container
                [tanstackField]="form"
                [name]="personName(index)"
                #name="field"
              >
                <label>
                  Name
                  <input
                    [name]="name.api.name"
                    [value]="name.api.value"
                    (blur)="name.api.handleBlur()"
                    (input)="name.api.handleChange($any($event).target.value)"
                  />
                </label>
              </ng-container>

              <ng-container
                [tanstackField]="form"
                [name]="personAge(index)"
                #age="field"
              >
                <label>
                  Age
                  <input
                    type="number"
                    [name]="age.api.name"
                    [value]="age.api.value"
                    (input)="
                      age.api.handleChange($any($event).target.valueAsNumber)
                    "
                  />
                </label>
              </ng-container>

              <button
                type="button"
                (click)="form.removeFieldValue('people', index)"
              >
                Remove person
              </button>
            </li>
          }
        </ul>
      </ng-container>

      <button type="button" (click)="addPerson()">Add person</button>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class PeopleFormComponent {
  form = injectForm({
    defaultValues: {
      people: [{ id: crypto.randomUUID(), name: '', age: 0 }],
    },
    onSubmit: ({ value }) => console.log(value),
  })

  personName(index: number): `people[${number}].name` {
    return `people[${index}].name`
  }

  personAge(index: number): `people[${number}].age` {
    return `people[${index}].age`
  }

  addPerson() {
    this.form.pushFieldValue('people', {
      id: crypto.randomUUID(),
      name: '',
      age: 0,
    })
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    void this.form.handleSubmit()
  }
}
```

## Array mutations

The form API exposes typed helpers for common operations:

```ts
form.pushFieldValue('people', { id: 'new', name: '', age: 0 })
form.insertFieldValue('people', 1, { id: 'new', name: '', age: 0 })
form.removeFieldValue('people', 0)
form.swapFieldValues('people', 0, 1)
form.moveFieldValue('people', 2, 0)
form.filterFieldValues('people', (person) => person.age >= 18)
form.clearFieldValues('people')
```

Use a stable item identifier in the Angular `track` expression when items can
be reordered. Tracking by index is sufficient only when item identity does not
matter.
