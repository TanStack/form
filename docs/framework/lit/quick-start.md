---
id: quick-start
title: Quick Start
---


The bare minimum to get started with TanStack Form is to create `FormOptions`and a `TanstackFormController`:

```ts
import type { FormOptions } from '@tanstack/lit-form'

interface Employee {
  firstName: string
  lastName: string
  employed: boolean
  jobTitle: string
}

interface Data {
  employees: Partial<Employee>[]
}

const formConfig: FormOptions<Data> = {}

#form = new TanstackFormController(this, formConfig)
```

In this example `this` references the instance of your `LitElement` in which you want to use TanStack Form.

To wire a form element in your template up with Tanstack Form simply use the `field` method of `TanstackFormController`:
```ts
render() {
 return html`
 <p>Please enter your first name></p>
 ${this.form.field(
          {
            name: `firstName`,
            validators: {
              onChange: ({ value }) =>
                value.length < 3 ? 'Not long enough' : undefined,
            },
          },
          (field: FieldApi<Employee, 'firstName'>) => {
            return html` <div>
              <label>First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
               @blur="${() => field.handleBlur()}"
               .value="${field.getValue()}"
               @input="${(event: InputEvent) => {
                   if (event.currentTarget) {
                     const newValue = (event.currentTarget as HTMLInputElement).value;
                     field.handleChange(newValue);
                   }
               }}"
              />
            </div>`
          },
        )}`;
}
```
The first parameter of `field` is `FieldOptions` and the second is callback to render your element. Be aware that you need
to handle updating the element and form yourself as seen in the example above. If you do not want to do this, you can use
the `bind` directive.

## The `bind` directive
Tanstack Form provides a `bind` directive which makes wiring up elements to the form a bit easier. You no longer need to
listen to events, update form state or component state, the `bind` directive will do it for you:
```ts
render() {
 return html`
 <p>Please enter your first name></p>
 ${this.form.field(
          {
            name: `firstName`,
            validators: {
              onChange: ({ value }) =>
                value.length < 3 ? 'Not long enough' : undefined,
            },
          },
          (field: FieldApi<Employee, 'firstName'>) => {
            return html` <div>
              <label>First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                ${bind(field)}
              />
            </div>`
          },
        )}`;
}
```
The required parameter of the `bind` directive is the instance of `FieldApi` you want to bind to.
By default, the directive works for HTML's text inputs, checkbox inputs and selects.

If you want to make it work for custom
elements you can provide a function as an optional argument, which tells the directive how to wire up to your custom elements.
This function has the following signature: `<T extends HTMLElement, Value = any>(
element: T,
): ControlValueAccessor<T, Value> | undefined`. `ControlValueAccessor` is a provided interface that describes how TanStack Form
should interact with a given element. You can find an example of this in the `ui-libraries`-example.
