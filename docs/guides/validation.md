---
id: form-validation
title: Form and Field Validation
---

# Form and Field Validation

At the core of TanStack Form's functionalities is the concept of validation. We currently support three mechanisms of validation:

- Synchronous functional validation
- Asynchronous functional validation
- Adapter-based validation

Let's take a look at each and see how they're built.

## Synchronous Functional Validation

With Form, you can pass a function to a field and, if it returns a string, said string will be used as the error:

```tsx
<form.Field
  name="age"
  onChange={val => val < 13 ? "You must be 13 to make an account" : undefined}
  children={(field) => {
    return (
      <>
        <label htmlFor={field.name}>First Name:</label>
        <input
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          type="number"
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        />
        {field.state.meta.touchedErrors ? (
          <em>{field.state.meta.touchedErrors}</em>
        ) : null}
      </>
    );
  }}
/>
```

### Displaying Errors

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
  children={(field) => {
    return (
      <>
        {/* ... */}
        {field.state.meta.errorMap['onChange'] ? (
          <em>{field.state.meta.errorMap['onChange']}</em>
        ) : null}
      </>
    );
  }}
/>
```

### Using Alternative Validation Steps

One of the great benefits of using TanStack Form is that you're not locked into a specific method of validation. For example, if you want to validate a specific field on blur rather than on text change, you can change `onChange` to `onBlur`:

```tsx
<form.Field
  name="age"
  onBlur={val => val < 13 ? "You must be 13 to make an account" : undefined}
  children={(field) => {
    return (
      <>
        {/* ... */}
      </>
    );
  }}
/>
```

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

This can be combined with the respective synchronous properties as well:

``` tsx
<form.Field
  name="firstName"
  onChange={(value) =>
    !value
      ? "A first name is required"
      : value.length < 3
      ? "First name must be at least 3 characters"
      : undefined
  }
  onChangeAsync={async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      value.includes("error") && 'No "error" allowed in first name'
    );
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


## Adapter-Based Validation