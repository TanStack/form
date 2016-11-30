# react-form
A microscopic form framework for React

[![Build Status](https://travis-ci.org/tannerlinsley/react-form.svg?branch=master)](https://travis-ci.org/tannerlinsley/react-form)
[![react-form on Slack](https://img.shields.io/badge/slack-react--table-blue.svg)](https://react-form-slack.herokuapp.com/)

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
