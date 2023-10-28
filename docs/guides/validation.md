---
id: form-validation
title: Form and Field Validation
---

At the core of TanStack Form's functionalities is the concept of validation. TanStack Form makes validation highly customizable:
- You can control when to perform the validation (on change, on input, on blur, on submit...)
- Validation rules can be defined at the field level or at the form level
- Validation can be synchronous or asynchronous (for example as a result of an API call)


## When is validation performed?

It's up to you! The `<Field />` component accepts some callbacks as props such as `onChange` or `onBlur`. Those callbacks are passed the current value of the field, as well as the fieldAPI object, so that you can perform the validation. If you find a validation error, simply return the error message as string and it will be available in `field.state.meta.errors`.

Here is an example:

```tsx
 <form.Field
  name="firstName"
  onChange={(value) => {
    return !value
      ? "A first name is required"
      : value.length < 3
        ? "First name must be at least 3 characters"
        : undefined;
  }}
>
  {(field) => {
    return (
      <>
        <label htmlFor={field.name}>First Name:</label>
        <input
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(', ')}</em> : null}
      </>
    );
  }}
</form.Field>
```

In the example above, the validation is done at each keystroke (`onChange`). If, instead, we wanted the validation to be done when the field is blurred, we would change the code above like so:

```tsx
<form.Field
  name="firstName"
  // Implement onBlur instead of onChange here
  onBlur={(value) => {
    return !value
      ? "A first name is required"
      : value.length < 3
        ? "First name must be at least 3 characters"
        : undefined;
  }}
>
  {(field) => {
    return (
      <>
        <label htmlFor={field.name}>First Name:</label>
        <input
          name={field.name}
          value={field.state.value}
          // Listen to the onBlur event on the field
          onBlur={field.handleBlur}
          // We always need to implement onChange, so that TanStack Form receives the changes
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(', ')}</em> : null}
      </>
    );
  }}
</form.Field>
```

So you can control when the validation is done by implementing the desired callback. You can even perform different pieces of validation at different times:

```tsx
<form.Field
  name="firstName"
  // Both onBlur and onChange are implemented here
  onBlur={(value) => {
    return !value
      ? "A first name is required"
      : value.length < 3
        ? "First name must be at least 3 characters"
        : undefined;
  }}
  onChange={(value) => value === 'error' && 'No error please!'}
>
  {(field) => {
    return (
      <>
        <label htmlFor={field.name}>First Name:</label>
        <input
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        {field.state.meta.errors ? <em role="alert">{field.state.meta.errors.join(', ')}</em> : null}
      </>
    );
  }}
</form.Field>
```

In the example above, we are validating different things on the same field at different times (at each keystroke and when blurring the field). Since `field.state.meta.errors` is an array, all the relevant errors at a given time are displayed. You can also use `field.state.meta.errorMap` to get errors based on *when* the validation was done (onChange, onBlur etc...). More info about displaying errors below.

## Displaying Errors

Once you have your validation in place, you can map the errors from an array to be displayed in your UI:

```tsx
<form.Field
  name="age"
  onChange={val => val < 13 ? "You must be 13 to make an account" : undefined}
  children={(field) => {
    return (
      <>
        {/* ... */}
        {field.state.meta.errors ? (
          <em>{field.state.meta.errors}</em>
        ) : null}
      </>
    );
  }}
/>
```

Or use the `errorMap` property to access the specific error you're looking for:

```tsx
<form.Field
  name="age"
  onChange={val => val < 13 ? "You must be 13 to make an account" : undefined}
>
  {(field) => (
      <>
        {/* ... */}
        {field.state.meta.errorMap['onChange'] ? (
          <em>{field.state.meta.errorMap['onChange']}</em>
        ) : null}
      </>
    )}
</form.Field>
```

## Validation at field level vs at form level

As shown above, each `<Field>` accepts its own validation rules via the `onChange`, `onBlur` etc... callbacks. It is also possible to define validation rules at the form level (as opposed to field by field) by passing similar callbacks to the `useForm()` hook.

<!-- TODO: add more details when those callbacks are fixed -->


## Asynchronous Functional Validation

While we suspect most validations will be synchronous, there's many instances where a network call or some other async operation would be useful to validate against.

To do this, we have dedicated `onChangeAsync`, `onBlurAsync`, and other methods that can be used to validate against:

```tsx
<form.Field
  name="firstName"
  onChangeAsync={async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      value.includes("error") && 'No "error" allowed in first name'
    );
  }}
  children={(field) => {
    return (
      <>
        <label htmlFor={field.name}>First Name:</label>
        <input
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        <FieldInfo field={field} />
      </>
    );
  }}
/>
```

Synchronous and Asynchronous validations can coexist. For example it is possible to define both `onBlur` and `onBlurAsync` on the same field:


``` tsx
<form.Field
  name="firstName"
  onBlur={(value) =>
    !value
      ? "A first name is required"
      : value.length < 3
      ? "First name must be at least 3 characters"
      : undefined
  }
  onBlurAsync={async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      value.includes("error") && 'No "error" allowed in first name'
    );
  }}
>
  {(field) => (
      <>
		{/* ... */}
      </>
  )}
</form.Field>
```

The synchronous validation method (`onBlur`) is run first and the asynchronous method (`onBlurAsync`) is only run if the synchronous one (`onBlur`) succeeds. To change this behaviour, set the `asyncAlways` option to `true`, and the async method will be run regardless of the result of the sync method.



### Built-in Debouncing

While async calls are the way to go when validating against the database, running a network request on every keystroke is a good way to DDOS your database.

Instead, we enable an easy method for debouncing your `async` calls by adding a single property:

```tsx
<form.Field
  name="firstName"
  asyncDebounceMs={500}
  onChangeAsync={async (value) => {
    // ...
  }}
  children={(field) => {
    return (
      <>
		{/* ... */}
      </>
    );
  }}
/>
```

This will debounce every async call with a 500ms delay. You can even override this property on a per-validation property:

```tsx
<form.Field
  name="firstName"
  asyncDebounceMs={500}
  onChangeAsyncDebounceMs={1500}
  onChangeAsync={async (value) => {
    // ...
  }}
  onBlurAsync={async (value) => {
    // ...
  }}
  children={(field) => {
    return (
      <>
		{/* ... */}
      </>
    );
  }}
/>
```

> This will run `onChangeAsync` every 1500ms while `onBlurAsync` will run every 500ms.

## Validating fields that depend on each other

Sometimes when validating a field value, we need to access the value of another field. For example a "repeat password" field that needs to be identical to a "password" field. On top of receiving the field value, each validation callback receives the `fieldAPI` object which has access to the `formAPI` object, which contains all the fields values.

Here is an example
```tsx
<form.Field
  name="password"
  children={(field) => (
    <>
      <label htmlFor={field.name}>Password:</label>
      <input
        name={field.name}
        value={field.state.value}
        type="password"
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
<form.Field
  name="repeat_password"
  onChange={(value, fieldAPI) => {
    if (value !== fieldAPI.form.store.state.values.password) {
      return "Passwords do not match";
    }

  }}
  children={(field) => (
    <>
      <label htmlFor={field.name}>Repeat password:</label>
      <input
        name={field.name}
        value={field.state.value}
        type="password"
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
```


## Adapter-Based Validation (Zod, Yup)

While functions provide more flexibility and customization over your validation, they can be a bit verbose. To help solve this, there are libraries like [Yup](https://github.com/jquense/yup) and [Zod](https://zod.dev/) that provide schema-based validation to make shorthand and type-strict validation substantially easier.

Luckily, we support both of these libraries through official adapters:

```bash
$ npm install @tanstack/zod-form-adapter zod
# or
$ npm install @tanstack/yup-form-adapter yup
```

Once done, we can add the adapter to the `validator` property  on the form or field:

```tsx
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

// ...

const form = useForm({
  // Either add the validator here or on `Field`
  validator: zodValidator,
  // ...
});

<form.Field
  name="firstName"
  validator={zodValidator}
  onChange={z
    .string()
    .min(3, "First name must be at least 3 characters")}
  children={(field) => {
    return (
      <>
         {/* ... */}
      </>
    );
  }}
/>
```

These adapters also support async operations using the proper property names:

```tsx
<form.Field
  name="firstName"
  onChange={z
    .string()
    .min(3, "First name must be at least 3 characters")}
  onChangeAsyncDebounceMs={500}
  onChangeAsync={z.string().refine(
    async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return !value.includes("error");
    },
    {
      message: "No 'error' allowed in first name",
    },
  )}
  children={(field) => {
    return (
      <>
         {/* ... */}
      </>
    );
  }}
/>
```

## Preventing invalid forms from being submitted

The `onChange`, `onBlur` etc... callbacks are also run when the form is submitted and submission is be blocked if the form is invalid.

The form state object has a `canSubmit` flag that is false when any field is invalid and the form has been touched (`canSubmit` is true until the form has been touched, even if some fields are "technically" invalid based on their `onChange`/`onBlur` props).

You can subscribe to it via `form.Subscribe` and use the value in order to, for example, disable the submit button when the form is invalid (in practice, disabled buttons are not accessible, use `aria-disabled` instead).

```tsx
const form = useForm(/* ... */);

return (
  /* ... */

  // Dynamic submit button
  <form.Subscribe
    selector={(state) => [state.canSubmit, state.isSubmitting]}
    children={([canSubmit, isSubmitting]) => (
      <button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "..." : "Submit"}
      </button>
    )}
  />
);
```
