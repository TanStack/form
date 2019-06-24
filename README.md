# ⚛️ 💼 React Form

React hooks for managing form state and lifecycle

<a href="https://travis-ci.org/react-charts/react-charts" target="\_parent">
  <img alt="" src="https://travis-ci.org/react-charts/react-charts.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-charts" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-charts.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/react-charts/react-charts" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/react-charts/react-charts.svg?style=social&label=Star" />
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

## Installation

```bash
$ yarn add react-form
# or
$ npm i react-form --save
```

## Quick Start

This will render a very basic form:

```javascript
import React from 'react'
import { useForm, useField, splitFormProps } from 'react-form'

// Build an input field
const InputField = React.forwardRef(function TextField(
  { field, ...rest },
  ref
) {
  // Use the useField hook with form props to access form state
  const {
    field: { setValue, value, setTouched, error, touched }
  } = useField(field)

  // Build your form input
  return (
    <>
      <input
        ref={ref}
        // Use setValue to update form values
        onChange={e => setValue(e.target.value)}
        // Use setTouched to update form touch state
        onBlur={() => setTouched(true)}
        value={value || ''}
        {...rest}
      />
      {
        // Use touched and error state to show errors
        touched && error ? <em>{error}</em> : null
      }
    </>
  )
})

function MyForm() {
  // Pass default values (be sure to memoize any options used)
  const defaultValues = React.useMemo(
    () => ({
      foo: 'hello',
      bar: {
        baz: 'world'
      }
    }),
    []
  )

  // Use the useForm hook to create a form instance
  const { Form } = useForm({
    // Pass the default values
    defualtValues,
    // Use a validate function
    validate: values => ({
      foo: !values.foo && 'Foo is required',
      bar: {
        baz: !values.bar.baz && 'Baz is required'
      }
    })
    // Handle form submission
    onSubmit: values => {
      console.log('These are the values:', values)
    }
  })

  return (
    // Use the built-in Form component provided by the hook
    // (or optionally construct your own with the `handleSubmit` function)
    <Form>
      <InputField field="foo" />
      <InputField field="bar" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

## Documentation

Complete documentation is **coming soon**.

Any sparse documentation available in this Readme is being progressively improved as the API evolves.

## API

React Charts exposes these top-level exports:

- `useForm` - The primary hook for creating a form.
