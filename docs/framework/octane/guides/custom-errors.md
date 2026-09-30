---
id: custom-errors
title: Custom Errors
---

TanStack Form provides complete flexibility in the types of error values you can return from validators. String errors are the most common and easy to work with, but the library allows you to return any type of value from your validators.

As a general rule, any truthy value is considered an error and will mark the form or field as invalid, while falsy values (`false`, `undefined`, `null`, etc.) mean there is no error, and the form or field is valid.

These examples use a form created with `useForm` from `@tanstack/octane-form` inside an Octane component. Put rendered code in `.tsrx` files, and place the display snippets inside a field's `children` render callback.

## Return String Values from Forms

```tsrx
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) => value.length < 3
      ? 'Username must be at least 3 characters'
      : undefined,
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

For form-level validation affecting multiple fields:

```ts
const form = useForm({
  defaultValues: {
    username: '',
    email: '',
  },
  validators: {
    onChange: ({ value }) => {
      return {
        fields: {
          username:
            value.username.length < 3 ? 'Username too short' : undefined,
          email: !value.email.includes('@') ? 'Invalid email' : undefined,
        },
      }
    },
  },
})
```

String errors are the most common type and are easily displayed in your UI:

```tsrx
@for (const error of field.state.meta.errors; index i; key i) {
  <div className="error">{error}</div>
}
```

### Numbers

Useful for representing quantities, thresholds, or magnitudes:

```tsrx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) => (value < 18 ? 18 - value : undefined),
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

Display in UI:

```tsrx
// TypeScript knows the error is a number based on your validator
<div className="error">
  You need
  {field.state.meta.errors[0]}
  more years to be eligible
</div>
```

### Booleans

Simple flags to indicate error state:

```tsrx
<form.Field
  name="accepted"
  validators={{
    onChange: ({ value }) => (!value ? true : undefined),
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

Display in UI:

```tsrx
@if (field.state.meta.errors[0] === true) {
  <div className="error">You must accept the terms</div>
}
```

### Objects

Rich error objects with multiple properties:

```tsrx
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) => {
      if (!value.includes('@')) {
        return {
          message: 'Invalid email format',
          severity: 'error',
          code: 1001,
        }
      }
      return undefined
    },
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

Display in UI:

```tsrx
<>
  @if (field.state.meta.errors[0]) {
    <div className={`error ${field.state.meta.errors[0].severity}`}>
      {field.state.meta.errors[0].message}
      <small> (Code: {field.state.meta.errors[0].code})</small>
    </div>
  }
</>
```

In the example above, the rendered message, code and styling depend on the event error you want to display.

### Arrays

Multiple error messages for a single field:

```tsrx
<form.Field
  name="password"
  validators={{
    onChange: ({ value }) => {
      const errors: string[] = []
      if (value.length < 8) errors.push('Password too short')
      if (!/[A-Z]/.test(value)) errors.push('Missing uppercase letter')
      if (!/[0-9]/.test(value)) errors.push('Missing number')

      return errors.length ? errors : undefined
    },
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

Display in UI:

```tsrx
<ul className="error-list">
  @for (const error of field.state.meta.errors; index i; key i) {
    <li>{error}</li>
  }
</ul>
```

## The `disableErrorFlat` Prop on Fields

By default, TanStack Form flattens errors from all validation sources (`onChange`, `onBlur`, `onSubmit`) into a single `errors` array. The `disableErrorFlat` prop keeps arrays returned by individual validators nested within that array:

```tsrx
<form.Field
  name="email"
  disableErrorFlat
  validators={{
    onChange: ({ value }) => !value.includes('@')
      ? 'Invalid email format'
      : undefined,
    onBlur: ({ value }) => !value.endsWith('.com')
      ? 'Only .com domains allowed'
      : undefined,
    onSubmit: ({ value }) => (value.length < 5 ? 'Email too short' : undefined),
  }}
  children={(field) => <>
    {/* Input and errors go here */}
  </>}
/>
```

You can access errors by their source through `field.state.meta.errorMap`, whether or not you enable `disableErrorFlat`:

```tsrx
<>
  @if (field.state.meta.errorMap.onChange) {
    <div className="real-time-error">{field.state.meta.errorMap.onChange}</div>
  }
  @if (field.state.meta.errorMap.onBlur) {
    <div className="blur-feedback">{field.state.meta.errorMap.onBlur}</div>
  }
  @if (field.state.meta.errorMap.onSubmit) {
    <div className="submit-error">{field.state.meta.errorMap.onSubmit}</div>
  }
</>
```

This is useful for:

- Displaying different types of errors with different UI treatments
- Prioritizing errors (e.g., showing submission errors more prominently)
- Implementing progressive disclosure of errors

## Type Safety of `errors` and `errorMap`

TanStack Form provides strong type safety for error handling. Each key in the `errorMap` has exactly the type returned by its corresponding validator, while the `errors` array contains a union type of all the possible error values from all validators:

```tsrx
<form.Field
  name="password"
  validators={{
    onChange: ({ value }) => {
      // This returns a string or undefined
      return value.length < 8 ? 'Too short' : undefined
    },
    onBlur: ({ value }) => {
      // This returns an object or undefined
      if (!/[A-Z]/.test(value)) {
        return { message: 'Missing uppercase', level: 'warning' }
      }
      return undefined
    },
  }}
  children={(field) => {
    // TypeScript knows that errors[0] can be string | { message: string, level: string } | undefined
    const error = field.state.meta.errors[0]

    // Type-safe error handling
    return <>
      @if (typeof error === 'string') {
        <div className="string-error">{error}</div>
      } @else if (error && typeof error === 'object') {
        <div className={error.level}>{error.message}</div>
      }
    </>
  }}
/>
```

The `errorMap` property is also fully typed, matching the return types of your validation functions:

```tsrx
// With disableErrorFlat
<form.Field
  name="email"
  disableErrorFlat
  validators={{
    onChange: ({ value }): string | undefined => !value.includes('@')
      ? 'Invalid email'
      : undefined,
    onBlur: ({ value }): { code: number; message: string } | undefined =>
      !value.endsWith('.com')
        ? { code: 100, message: 'Wrong domain' }
        : undefined,
  }}
  children={(field) => {
    // TypeScript knows the exact type of each error source
    const onChangeError: string | undefined = field.state.meta.errorMap.onChange
    const onBlurError: | { code: number; message: string }
    | undefined = field.state.meta.errorMap.onBlur

    return <>
      @if (onChangeError) {
        <div>{onChangeError}</div>
      }
      @if (onBlurError) {
        <div>{onBlurError.message} (Code: {onBlurError.code})</div>
      }
    </>
  }}
/>
```

This type safety helps catch errors at compile time instead of runtime, making your code more reliable and maintainable.
