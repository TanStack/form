---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/lit-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library and its usage with Lit.

## Form Options

You can create options for your form so that it can be shared between multiple forms by using the `formOptions` function.

For Example:

```tsx
const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    employed: false,
    jobTitle: '',
  } as Employee,
})
```

## Form Instance

A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the `TanStackFormController` interface provided by `@tanstack/lit-form`. The `TanStackFormController` is instantiated with the current form's (`this`) class and some default form options. It initializes the form state, handles form submission, and provides methods to manage form fields and their validation.

```tsx
#form = new TanStackFormController(this, {
  defaultValues: {
    firstName: '',
    lastName: '',
    employed: false,
    jobTitle: '',
  } as Employee,
})
```

You may also create a form instance without using `formOptions` by using the standalone `TanStackFormController` API:

```tsx
#form = new TanStackFormController(this, {
  ...formOpts,
})
```

## Field

A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the `field(FieldOptions, callback)` provided by the form instance. The component accepts a `FieldOptions` object and a callback function that receives a `FieldApi` object. This object provides methods to get the current value of the field, handle input changes, and handle blur events.

For Example:

```ts
 ${this.#form.field(
    {
      name: `firstName`,
      validators: {
        onChange: ({ value }) =>
          value.length < 3 ? "Not long enough" : undefined,
        },
      },
      (field: FieldApi<Employee, "firstName">) => {
        return html` <div>
          <label class="first-name-label">First Name</label>
          <input
           id="firstName"
           type="text"
           class="first-name-input"
           placeholder="First Name"
           @blur="${() => field.handleBlur()}"
           .value="${field.state.value}"
           @input="${(event: InputEvent) => {
           if (event.currentTarget) {
            const newValue = (event.currentTarget as HTMLInputElement).value;
            field.handleChange(newValue);
           }
          }}"
        />
      </div>`;
    },
)}
```

## Field State

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using its `field.state` property.

```tsx
const {
  value,
  meta: { errors, isValidating },
} = field.state
```

There are three field states can be very useful to see how the user interacts with a field. A field is _"touched"_ when the user clicks/tabs into it, _"pristine"_ until the user changes value in it, and _"dirty"_ after the value has been changed. You can check these states via the `isTouched`, `isPristine` and `isDirty` flags, as seen below.

```tsx
const { isTouched, isPristine, isDirty } = field.state.meta
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)
