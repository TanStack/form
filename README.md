# ⚛️ 💼 React Form

React hooks for managing form state and lifecycle

<a href="https://travis-ci.org/tannerlinsley/react-form" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-form.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-form" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-form.svg" />
</a>
<a href="https://spectrum.chat/react-form">
  <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>
<a href="https://github.com/tannerlinsley/react-form" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-form.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

<!--
## Features
- Put some features here
-->

## Intro

React Form is currently in **alpha**! This means:

- The existing API is not stable. Expect major changes/additions **as minor and patch releases** while use-cases evolve.
- It is not recommended for **mission critical** production code.

## Table of Contents

- [Installation](#installation)
- [Quick Example](#quick-example)
- [Documentation](#documentation)
  - [`useForm`](#useform) - The primary hook for creating a form.
    - [Form Validation](#form-validation)
    - [Synchronous Validation](#synchronous-validation)
    - [Asynchronous Validation](#asynchronous-validation)
    - [Mixed Sync + Async Validation:](#mixed-sync--async-validation)
    - [Debouncing Form Validation](#debouncing-form-validation)
    - [Sync Debouncing](#sync-debouncing)
    - [Async Debouncing](#async-debouncing)
    - [Mixed Sync/Async Debouncing](#mixed-syncasync-debouncing)
    - [Manually manage `meta` and field `meta`](#manually-manage-formmeta-and-field-meta)
  - [`useField`](#usefield) - A hook for utilizing form state and lifecycle on the field level.
    - [Field Validation](#field-validation)
  - [`useFormContext`](#useformcontext) - Use this hook to gain access to the form state within a `useForm`'s `Form` component.
  - [`splitFormProps`](#splitformprops) - A function for automatically extracting React-Form-related props from an object

## Installation

```bash
$ yarn add react-form
# or
$ npm i react-form --save
```

## Quick Example

This will render a very basic form:

```js
import React from 'react'
import { useForm, useField } from 'react-form'

// Build an basic TextInput field
const InputField = React.forwardRef(({ field, validate, ...rest }, ref) => {
  // Use the useField hook with form props to access form state
  const {
    value,
    meta: { error, isTouched },
    setValue,
    setMeta,
  } = useField(field, {
    validate,
  })

  // Build your form input
  return (
    <>
      <input
        ref={ref}
        // Use setValue to update form values
        onChange={e => setValue(e.target.value)}
        // Use setMeta to update form touch state
        onBlur={() => setMeta({ isTouched: true })}
        value={value}
        {...rest}
      />
      {/* Use isTouched and error state to show errors */}
      {isTouched && error ? <em>{error}</em> : null}
    </>
  )
})

function MyForm() {
  // Pass default values (be sure to memoize any options used)
  const defaultValues = React.useMemo(
    () => ({
      foo: 'hello',
      bar: {
        baz: 'world',
      },
    }),
    []
  )

  // Use the useForm hook to create a form instance
  const { Form } = useForm({
    // Pass the default values
    defaultValues,
    // Handle form submission
    onSubmit: values => {
      console.log('These are the values:', values)
    },
  })

  return (
    // Form is just a thin wrapper around the `form` html element.
    // It automatically wires up the onSubmit logic and context for `useField`
    <Form>
      <InputField field="foo" />
      <InputField
        field="bar.baz"
        validate={value => (!value ? 'Baz is required!' : false)}
      />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

# Documentation

## `useForm`

```js
import { useForm } from 'react-form'

const instance = useForm(options)
```

### Form Options

- `defaultValues: any`
  - Use defaultValues to set the default values state for the form. If this object ever changes, the state will be reset to the new object. Thus, its important to use React.useMemo to make this object only change when necessary
- `onSubmit(values, instance) => Promise`
  - `onSubmit` is called when the form's Form element is submitted or when `instance.handleSubmit` is called.
  - `values` is the submitted values object for the form
  - `instance` is the latest version of the form instance (the same instance that is returned from `useForm`)
  - If the promise returned from this function resolves, `instance.isSubmitted` will be set to `true`
  - When the promise returned from this function settles, `instance.isSubmitting` will be set to `false`
- `validate async (values, instance) => String | false | undefined`
  - `validate` is an asynchronous function that is called when the form becomes dirty and is given the opportunity to set/clear/update errors and/or manage general form state
  - `instance` is the latest version of the form instance (the same instance that is returned from `useForm`)
  - [See below](#form-validation) for more information on form validation
  - Field level validation is also available. [See `useField`](#useField)
- `validatePristine: Bool`
  - If you want validation to run when instance.isDirty is false, you can set the `validatePristine` option to `true`

### Form Instance

An `object` with the following components, properties and methods:

- `Form: ReactComponent<form>`
  - **Required**
  - This component is a ready-to-use wrapper around the html `form` element.
  - It will proxy any props you pass it, excluding `onSubmit`.
    - It properly supplies the form context to any `useField` instances inside it.
- `values: any`
  - The current values for the entire form
- `meta: Object`
  - `error: String | any`
    - If an error is returned by the form's `validation` function, or if it is set programmatically, it will be stored here.
  - `isSubmitting: Bool`
    - Will be set to `true` if the form is currently submitting
  - `isDirty: Bool`
    - Will be set to `true` if the form is dirty
  - `isSubmitted: Bool`
    - Will be set to `true` if the form has been submitted successfully
  - `submissionAttempts: Int`
    - Will be incremented, starting from `0`, every time a form submission is attempted
  - `isValid: Bool`
    - Will be set to `true` if `isDirty === true` and `isValid === true`, meaning that the form has been touched and there are no field-level or form-level errors
  - `canSubmit: Bool`
    - Will be set to `true` if `isValid === true` and `isSubmitting === false`
    - This can be used to enable/disable a submit button for the form.
  - `...any`
    - Any other meta information can be stored here via the `field.setMeta` or `instance.setFieldMeta` functions
- `debug: Bool`
  - If set to `true` the form instance will be serialized and rendered after the `Form` element returned by the instance
- `reset() => void`
  - This function will reset the form's state, and set `instance.values` to the `defaultValues` option
- `setMeta((updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update the form's `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `handleSubmit(formSubmitEvent) => void`
  - This function is used to submit the form.
  - It is automatically called when using the `Form` component returned by `useTable`.
  - If you build your form using your own `form` element, this function is required and should be set as the callback to the `form` via the `onSubmit` prop
- `debounce(Function, wait: Int) => Promise`
  - This function can be used to debounce any function at the specified wait time. Calls to this function will be deduped per form-instance.
  - Typically, this function is used in the `validate` callback to control validation timing and flow
  - A new promise is returned for each call to this function
  - Over the course of multiple overlapping calls to this function, only the latest active promise that both fires and finishes will actually resolve or reject. In other words, if you call this function before a previous call to it resolves, all previous calls will be discarded and never resolve or reject so as to avoid unwanted side effects from stale promises. Turns out this is easier than cancelling promises :)
- `setValues(updater(previousValues: Object) => newValues: Object) | newValues: Object`
  - Use this function to update the form's `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - If a value is passed, it **will replace the entire values** object, similar to React's `setState` callback style.
- `runValidation() => void`
  - Use this function to manually run the form-level validation.
  - This function does not run validation for fields. If that is a requirement you have, the please file a feature request and I'll make it happen.
- `getFieldValue(fieldPath: String) => any`
  - This function returns the `value` from the form's `instance.values` object located at the `fieldPath` string that was passed.
  - `fieldPath` is a string that supports object notation, eg. `foo[3].bar[1].baz`
- `getFieldMeta(fieldPath: String) => Object: { error: String | null, ...any }`
  - This function returns a field's `meta` object from the form.
  - `fieldPath` is a string that supports object notation, eg. `foo[3].bar[1].baz`
- `setFieldValue(fieldPath: String, (updater(previousValue: any) => newValue: any) | newValue: any, options: Object { isTouched: Bool } )`
  - Use this function to update a field's corresponding `value` that is stored in the `instance.values` object.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
  - Optionally, an `options` object can be passed.
    - `isTouched: Bool`
      - Defaults to `true`
      - If set to `false`, this operation will not trigger the field's `isTouched` to automatically be set to `true`
- `setFieldMeta(fieldPath: String, (updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update a fields `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `pushFieldValue(fieldPath: String, newValue: any)`
  - Use this function to push a new value into a field that has an array-like value.
  - An error will be thrown if the field's current value is not an array.
- `insertFieldValue(fieldPath: String, insertIndex: Int, value: any)`
  - Use this function to insert a new value into a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `removeFieldValue(fieldPath: String, removalIndex: Int)`
  - Use this function to remove a value from a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `swapFieldValues(fieldPath: String, firstIndex: Int, secondIndex: Int)`
  - Use this function to swap two values inside of a field that has an array-like value at the specified indices.
  - An error will be thrown if the field's current value is not an array.

## `useField`

```js
import { useField } from 'react-form'

const fieldInstance = useField(fieldPath, options)
```

### Field Options

- `fieldPath: String`
  - **Required**
  - The path the value for this field.
  - Supports deeply nested object notation, eg. `foo[3].bar[1].baz`
  - Periods and brackets are used to specify array indices vs object keys.
  - Object keys should not contain quotes or use bracket syntax, eg. `foo.bar` is correct. Do not use `foo[bar]` or `foo['bar']`
  - Array indices should be integers and not contain quotes. eg. use `foo[3].bar[1].baz`. Do not use `foo.3.bar.1.baz`, as this would result in objects with keys `3` and `1` instead of arrays and indices.
- `options` - An optional object to configure the field
  - `defaultValue: any`
    - Use `defaultValue` to set the default `value` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultError: String | undefined`
    - Use `defaultError` to set the default `error` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultIsTouched: Bool | undefined`
    - Use `defaultIsTouched` to set the default `isTouched` state for the field.
    - If this object ever changes, the field meta will be reset to the new value. Thus, its important to use `React.useMemo` to make this object only change when necessary
  - `defaultMeta: Object | undefined`
    - Use `defaultMeta` to set any additional default `meta` state for the field.
    - Unlike `defaultValue`, `defaultError` and `defaultIsTouched`, changing this object will not trigger the field meta to be updated. It is only updated when the `useField` hook mounts and `meta` for that field has not yet been initialized (`meta === undefined`)
  - `validate async (value, instance) => String | false | undefined`
    - `validate` is an asynchronous function that is called when the field becomes dirty and is given the opportunity to set/clear/update errors and/or manage general field meta
    - `instance` is the latest version of the field instance (the same instance that is returned from `useField`)
    - [See below](#validation) for more information on field validation
    - Form level validation is also available. [See `useForm`](#useform)
  - `validatePristine: Bool`
    - If you want validation to run when instance.isDirty is false, you can set the `validatePristine` option to `true`

### Field Instance

An `object` with the following components, properties and methods:

- `form: FormInstance`
  - The root form `instance`
- `fieldName: String`
  - The full fieldName (from the root of the form) for this field
- `value: any`
  - The current value of this field
- `meta: Object {}`
  - `error: String | any`
    - If an error is returned by the field's `validation` function, or if it is set programmatically, it will be stored here.
  - `isTouched: Bool`
    - Will be set to `true` if the field has been touched.
  - `...any`
    - Any other meta information can be stored here via the `field.setMeta` or `instance.setFieldMeta` functions
- `FieldScope: ReactComponent<Provider>`
  - Optional
  - This component does not render any markup
  - It set the new base field scope to this field's `fieldpath`
  - It supplies this new base field scope, along with the form scope to any `useField` instances inside it.
  - Any `useField(fieldPath)` instances used insde of `FieldScope` will inherit this field's `fieldPath` as a parent.
  - See [Field Scoping](#field-scoping) for more information
- `debounce(Function, wait: Int) => Promise`
  - This function can be used to debounce any function at the specified wait time. Calls to this function will be deduped per `useField` instance.
  - Typically, this function is used in the `validate` callback to control validation timing and flow
  - A new promise is returned for each call to this function
  - Over the course of multiple overlapping calls to this function, only the latest active promise that both fires and finishes will actually resolve or reject. In other words, if you call this function before a previous call to it resolves, all previous calls will be discarded and never resolve or reject so as to avoid unwanted side effects from stale promises. Turns out this is easier than cancelling promises :)
- `runValidation() => void`
  - Use this function to manually run this field's validation.
  - This function does not run validation for fields.

#### Field-Specific Methods

The following methods do not require the use of a `fieldPath`. This field's `fieldPath` will automatically be used.

- `setValue((updater(previousValue: any) => newValue: any) | newValue: any, options: Object { isTouched: Bool } )`
  - Use this function to update a field's corresponding `value` that is stored in the `instance.values` object.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
  - Optionally, an `options` object can be passed.
    - `isTouched: Bool`
      - Defaults to `true`
      - If set to `false`, this operation will not trigger the field's `isTouched` to automatically be set to `true`
- `setMeta((updater(previousMeta: Object) => newMeta: Object) | newMeta: Object)`
  - Use this function to update a fields `meta` value.
  - If a callback is passed, it will be given the previous value and be expected to return a new one, similar to React's `setState` callback style.
  - Unlike React's setState pattern though, if a new object is passed, it will **NOT** replace the meta object entirely. Since this is a common use case, it will be shallowly merged. If you need to replace the entire meta object, please use the functional callback style above.
- `pushValue(newValue: any)`
  - Use this function to push a new value into a field that has an array-like value.
  - An error will be thrown if the field's current value is not an array.
- `insertValue(insertIndex: Int, value: any)`
  - Use this function to insert a new value into a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `removeValue(removalIndex: Int)`
  - Use this function to remove a value from a field that has an array-like value at the specified index.
  - An error will be thrown if the field's current value is not an array.
- `swapValues(firstIndex: Int, secondIndex: Int)`

  - Use this function to swap two values inside of a field that has an array-like value at the specified indices.
  - An error will be thrown if the field's current value is not an array.

#### Field-Scope Specific Methods

The following methods are almost exactly the same as their top-level form `instance` counterparts, except for any `fieldPath` that is passed to them will be prefixed with this field's `fieldPath`

For example, if our field had the `fieldPath` of `foo`, then `setFieldValue('[0]', true)` would be similar to calling `instance.setFieldValue('foo[0]', true)`

- `setFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `setFieldMeta(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `pushFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `insertFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `removeFieldValue(subFieldPath, ...)` - [See Form Instance](#form-instance)
- `swapFieldValues(subFieldPath, ...)` - [See Form Instance](#form-instance)

## Validation

### Synchronous Validation

If you don't need to perform any async validation in your form or field, you can just return a value directly:

- If this function resolve truthy, the value returned will be stored in either the form's `instance.meta.error` or the field's `meta.error` value
- If this function resolve `false`, the error in either the form's `instance.meta.error` or the field's `meta.error` value the will be set to `null`
- if this function resolve `undefined`, no changes will happen

```js
const options = {
  validate: value => {
    // To set an error:
    if (!somethingIsWrong) {
      return 'This form/field has a form-level error'
    }
    // To clear any errors:
    return false
  },
}
```

### Asynchronous Validation

Asynchronous validation is as easy as returning a promise:

```js
const options = {
  validate: async value => {
    // If you need to perform async validation, you can return a promise
    const error = await validateOnServer(values)

    if (error) {
      return error
    }
    return false
  },
}
```

### Mixed Sync + Async Validation:

```js
const options = {
  validate: async value => {
    // You can mix synchronous and asynchronous validation easily with this pattern
    // First check for synchronous errors
    if (!values.foo || !values.bar) {
      return 'Foo and bar are required!'
    }
    // Then return a promise that resolves any async errors
    const error = await validateOnServer(values)
    return error ? error : false
  },
}
```

### Debouncing Form Validation

If you're validation is firing too often, you can debounce any stage of your validation function (sync or async) with React Form's built-in debounce utility. `instance.debounce` returns a promise that only resolves for the latest call after a given amount of time. This way, any outdated validation attempts are discarded automatically.

### Sync Debouncing

```js
const options = {
  validate: (values, instance) => {
    return instance.debounce(() => {
      // Wait 1000 milliseconds before validating anything
      if (!values.foo || !values.bar) {
        return 'Foo and bar are required!'
      }

      return false
    }, 1000)
  },
}
```

### Async Debouncing

```js
const options = {
  validate: async (values, instance) => {
    return instance.debounce(() => {
      // Wait 2 seconds before validating on the server
      const error = await validateOnServer(values)
      return error ? error : false
    }, 2000)
  }
}
```

### Mixed Sync/Async Debouncing

```js
const options = {
  validate: async (values, instance) => {
    if (!values.foo || !values.bar) {
      return 'Foo and bar are required!'
    }
    // Then, if sync validation passes
    return instance.debounce(() => {
      // Wait 2 seconds before validating on the server
      const error = await validateOnServer(values)
      return error ? error : false
    }, 2000)
  }
}
```

### Manually manage `meta` or a field `meta`

Returning an error string or false from validate is simply shorthand for setting/unsetting the `error` property on either the form's `instance.meta` object or a field's `meta` object. If you don't want to set an error and would rather set a success or warning message, you can use the `instance.setMeta` (for form-level validation) or the `instance.setMeta` function (for field-level validation). More than just the error field can be set/used on both the `instance.meta` object and each individual field's `meta` object. You could use this meta information for success messages, warnings, or any other information about a field. Only the `error` and `isTouched` meta properties are used internally by React Form to determine form validity.

```js
const options = {
  validate: async (values, instance) => {
    const serverError = await validateOnServer(values)

    if (serverError) {
      setMeta({
        error: serverError,
        message: null,
        errorStack: serverError.stack,
      })
    } else {
      setMeta({
        error: null,
        message: 'The form is good to be submitted!',
        errorStack: null,
      })
    }

    // Make sure this function returns undefined if you are handling
    // meta manually.
  },
}
```

## Field Scoping

Field scoping is useful for building form inputs that don't require knowledge of the parent field name. Imagine a field component for managing some notes on a form:

```js
function NotesField({ field }) {
  const fieldInstance = useField(field)

  // ...
}
```

This approach would required us to define the nested `field` when we use the component:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <NotesField field="notes" />
    </Form>
  )
}
```

This isn't a problem for shallow forms, but if we are in a deeply nested part of a form UI, it get's more verbose:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <ConfigField field="config" />
    </Form>
  )
}

function ConfigField({ field: parentField }) {
  return (
    <>
      <NotesField field={`${parentField}.notes`} />
      <OtherField field={`${parentField}.other`} />
      <FooField field={`${parentField}.foo`} />
    </>
  )
}
```

Instead of requiring that all deep fields be composed with their parent strings, you can use the `FieldScope` component returned by the `useField` hook to create a new field scope for any `useField` instances rendered inside of it:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <ConfigField field="config" />
    </Form>
  )
}

function ConfigField({ field: parentField }) {
  const { FieldScope } = useField('config')
  return (
    <FieldScope>
      <NotesField field="notes" />
      <OtherField field="other" />
      <FooField field="foo" />
    </FieldScope>
  )
}
```

Using this approach, you can avoid having to compose deeply nested field names!
