![React Form Header](https://github.com/tannerlinsley/react-form/raw/master/media/header.png)

<img src='https://github.com/tannerlinsley/react-form/raw/master/media/logo.png' width='300'/>

Hooks for managing form state and validation in React

<a href="https://travis-ci.org/tannerlinsley/react-form" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-form.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-form" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-form.svg" />
</a>
<a href="https://bundlephobia.com/result?p=react-form@next" target="\_parent">
  <img alt="" src="https://badgen.net/bundlephobia/minzip/react-form@next" />
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
<br />
<br />
<a href="https://patreon.com/tannerlinsley">
  <img width="180" alt="" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/become-a-patron.png" />
</a>

## Features

- Built **with** React hooks **for** React hooks
- Highly practical validation API with 1st-class asynchronous support
- Built-in validation debouncing with auto cancellation for stale validations
- Field Scoping for deeply nested form values
- No nonsense meta management for both forms and form fields
- Fully memoized for frequent and fast rerenders
- Flexible form API at the field, scope, and form levels

## Examples & Demos

- [Basic Form](https://codesandbox.io/s/react-form-demo-q9mgm)

## Table of Contents

- [Installation](#installation)
- [Quick Example](#quick-example)
- [Documentation](#documentation)
  - [`useForm`](#useform)
  - [`useField`](#usefield)
  - [Validation](#validation)
    - [Synchronous Validation](#synchronous-validation)
    - [Asynchronous Validation](#asynchronous-validation)
    - [Mixed Sync + Async Validation:](#mixed-sync--async-validation)
    - [Debouncing Form Validation](#debouncing-form-validation)
    - [Sync Debouncing](#sync-debouncing)
    - [Async Debouncing](#async-debouncing)
    - [Mixed Sync/Async Debouncing](#mixed-syncasync-debouncing)
    - [Manually manage form `meta` and field `meta`](#manually-manage-form-meta-and-field-meta)
  - [Field Scoping](#field-scoping)
  - [`useFormContext`](#useformcontext)
  - [`splitFormProps`](#splitformprops)

## Installation

```bash
$ yarn add react-form
# or
$ npm i react-form --save
```

## Quick Example

Next, let's build a reusable input field.

```js
import { useField, splitFormProps } from 'react-form'

const InputField = React.forwardRef((props, ref) => {
  // Let's use splitFormProps to get form-specific props
  const [field, fieldOptions, rest] = splitFormProps(props)

  // Use the useField hook with a field and field options
  // to access field state
  const {
    meta: { error, isTouched, isValidating },
    getInputProps,
  } = useField(field, fieldOptions)

  // Build the field
  return (
    <>
      <input
        {...getInputProps({ ref, ...rest })}

        // This will give us the following props:
        // {
        //   value: field.value,
        //   onChange: e => field.setValue(e.target.value),
        //   onBlur: e => field.setMeta({ isTouched: true }),
        //   ref,
        //   ...rest
        // }
        //
        // You can always wire this up on your own, but prop
        // getters are great for this!
      />

      {/*
        Let's inline some validation and error information
        for our field
      */}

      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </>
  )
})
```

Now that we have an input field, we can build our form!

```js
function MyForm() {
  // Memoize some default values
  const defaultValues = React.useMemo(
    () => ({
      name: 'Tanner',
      address: {
        street: '123 React Road',
      },
    }),
    []
  )

  // Use the useForm hook to create a form instance
  const {
    Form,
    meta: { isSubmitting, canSubmit },
  } = useForm({
    defaultValues,
    onSubmit: async (values, instance) => {
      // onSubmit (and everything else in React Form)
      // has async support out-of-the-box
      await sendToServer(values)

      // The entire up-to-date form api is
      // always available, everywhere
      instance.reset()
    },
  })

  return (
    <Form>
      <label>
        Name: <InputField field="name" />
      </label>
      <label>
        Address Street:{' '}
        <InputField
          field="address.street"
          validate={value => (!value ? 'Baz is required!' : false)}
        />
      </label>

      {isSubmitting ? 'Submitting...' : null}

      <button type="submit" disabled={!canSubmit}>
        Submit
      </button>
    </Form>
  )
}
```

# Documentation

- API
- Validation Guide

## Sponsors

**React Form** is built and maintained by me, @tannerlinsley and I am always in need of more Patreon support to keep this project afloat. If you would like to contribute to my Patreon for React Form or my other open source libraries, [visit my Patreon and help me out!](https://patreon.com/tannerlinsley)

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width='200' src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum.png">
        </a>
      </td>
       <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="250" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum-placeholder.png">
        </a>
      </td>
       <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="250" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width='200' src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold.png">
        </a>
      </td>
       <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="150" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold-placeholder.png">
        </a>
      </td>
       <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="150" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold-placeholder.png">
        </a>
      </td>
      </td>
       <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="150" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width='200' src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="100" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="100" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="100" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img width="100" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td valign="top">
        <a href="https://patreon.com/tannerlinsley">
          <img width='200' src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/supporters.png" />
        </a>
      </td>
      <td>
        <div><a href="https://patreon.com/tannerlinsley">Your Name and Link Here!</a></div>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td valign="top">
        <a href="https://patreon.com/tannerlinsley">
          <img width='200' src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/fans.png" />
        </a>
      </td>
      <td>
        <div><a href="https://patreon.com/tannerlinsley">Your Name Here!</a></div>
      </td>
    </tr>
  </tbody>
</table>

<a href="https://patreon.com/tannerlinsley">
  <img width="150" alt="" src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/become-a-patron.png" />
</a>
