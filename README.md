<div align="center">
  <a href="https://github.com/tannerlinsley/react-form"><img src="/media/banner.png?raw=true" alt="React Table Logo" style="width:550px;"/></a>
  <br />
  <br />
</div>

[![npm version](https://badge.fury.io/js/react-form.svg)](https://badge.fury.io/js/react-form) [![Build Status](https://travis-ci.org/tannerlinsley/react-form.svg?branch=master)](https://travis-ci.org/tannerlinsley/react-form) [![Libraries.io for GitHub](https://img.shields.io/librariesio/github/tannerlinsley/react-form.svg)]()

React Form is a lightweight framework and utility for building powerful forms in React applications.

## Features

- **4kb!** (minified)
- Dynamic Fields - no pre-defined schema or field names required
- Highly functional and flexible validation
- Built-in Form Inputs
- Input Utility - Easily and quickly build your own input types
- Field Utility - Functionally control any field, anywhere in a form
- Nested forms and form splitting
- Powerful form lifecycle hooks and events
- Serializable Event and State hooks (think redux/mobx/etc & HMR)

## [Demo](http://react-form.zabapps.com)

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [API](#api)
<!-- - [Recipes](#recipes) -->

<a name="installation"></a>
## Installation
```bash
$ npm install react-form
```

<a name="example"></a>
## Example
```javascript
import React from 'react'
import { Form, Text } from 'react-form'

const MyForm = Form({
  validate: values => {
    return {
      firstName: !values.firstName ? 'Required' : undefined,
      lastName: !values.lastName ? 'Required' : undefined,
      hobby: !values.hobby ? 'Required' : undefined
    }
  }
})(({ submitForm }) => {
  return (
    <form onSubmit={submitForm}>
      <Text
        field='firstName'
        placeholder='First Name'
      />
      <Text
        field='lastName'
        placeholder='Last Name'
      />
      <Text
        field='hobby'
        placeholder='Hobby'
      />
      <Select
        field='status'
        options={[{
          label: 'Available',
          value: 'available'
        }, {
          label: 'Unavailable',
          value: 'unavailable'
        }]}
      />
      <Textarea
        field='notes'
        placeholder='Notes'
      />
      <button>
        Submit
      </button>
    </form>
  )
})

export default props => {
  return (
    <MyForm
      onSubmit={(values) => {
        window.alert(JSON.stringify(values, null, 2))
      }}
    />
  )
}
```

## API

### { Form }
- Usage: `Form(defaultProps)(component)`
- Returns a new react-form component
- Call it first with any default props for your form including lifecycle methods, validation, etc, then call the returned function with a react component to render the form.

**Example**
```javascript
import { Form } from 'react-form'

const myFormComponent = Form({
  validate () {...},
  // other default props
})(myReactComponent)
```

### { FormDefaultProps }
- An object of the global default props for every react-form you create.
- You can assign new global defaults to this object anywhere before creating a new react-form

**Example**
```javascript
import { FormDefaultProps } from 'react-form'

Object.assign(FormDefaultProps, {
  onValidationFail: () => { console.log('uh oh...') }
})
```

### { FormField }
- A low-level react component that can be used anywhere within a form to expose the api for any field.
- The child of `FormField` must be a function that returns valid JSX. This function is passed one parameter, the form api object.
- The form api object contains every method to manage the form state.
- If a `field` is passed, every API method will be auto-bound to use that field. Otherwise, they operate at the form-level as usual.

**Example**
```javascript
import { FormField } from 'react-form'

function customInput ({field, ...rest}) {
  return (
    <FormField field={field}>
      {({ setValue, getValue, setTouched }) => {
        return (
          <input
            value={getValue()}
            onChange={e => setValue(e.target.value)}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormField>
  )
}
```

## Contributing
To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- `npm install`
- `npm watch`
- Implement your changes to files in the `src/` directory
- Submit PR for review

If you would like to preview your changes, you can link and utilize the example like so:

- `npm link`
- `cd example`
- `npm install`
- `npm link react-form`
- `npm watch`
- Make changes to the example in `src/screens/index.js` if needed
- View changes at `localhost:8000`

## Used By

<a href='https://nozzle.io'>
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
