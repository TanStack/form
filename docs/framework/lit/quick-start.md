---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a `TanstackFormController` as seen below with the `Employee` interface for our test form:

```ts
interface Employee {
  firstName: string
  lastName: string
  employed: boolean
  jobTitle: string
}

#form = new TanStackFormController()<Employee>(this, {
  defaultValues: {
    firstName: '',
    lastName: '',
    employed: false,
    jobTitle: '',
  },
})
```

In this example `this` references the instance of your `LitElement` in which you want to use TanStack Form.

To wire a form element in your template up with TanStack Form, use the `field` method of `TanstackFormController`.

The first parameter of `field` is `FieldOptions` and the second is callback to render your element.

```ts
field(FieldOptions, callback)
```

Our completed test form should look something like below. The form collects first name from a user input field:

```ts
export class TestForm extends LitElement {
  #form = new TanStackFormController<Employee>(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
      employed: false,
      jobTitle: '',
    },
  })
  render() {
    return html` <p>Please enter your first name></p>
      ${this.#form.field(
        {
          name: `firstName`,
          validators: {
            onChange: ({ value }) =>
              value.length < 3 ? 'Not long enough' : undefined,
          },
        },
        (field: FieldApi<Employee, 'firstName'>) => {
          return html` <div>
            <label class="first-name-label">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              @blur="${() => field.handleBlur()}"
              .value="${field.getValue()}"
              @input="${(event: InputEvent) => {
                if (event.currentTarget) {
                  const newValue = (event.currentTarget as HTMLInputElement)
                    .value
                  field.handleChange(newValue)
                }
              }}"
            />
          </div>`
        },
      )}`
  }
}
```

Be aware that you need
to handle updating the element and form yourself as seen in the example above.
