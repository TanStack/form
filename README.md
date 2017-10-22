# A savage react form library

[![Build Status](https://travis-ci.org/joepuzzo/react-savage-form.svg?branch=master)](https://travis-ci.org/joepuzzo/react-savage-form)

# Intro
Say hello to the best react form library you have ever used! `react-savage-form` is an extensive, simple, and efficient solution to creating simple to complex forms in react. Out of the box you get the ability to grab and manipulate values; set errors, warnings, and successes; customize your inputs, perform asynchronous validation, and much more!

# Motivation
Simplicity and efficiency. This form works in IE! and its fast! There are many other libraries that exist, but they don't function in IE and, can get pretty complex. I must give credit to [react-form](https://github.com/tannerlinsley/react-form), as this library was the inspiration for building react-savage-form.

# Installation
`npm install --save react-savage-form`

# Basic usage
```javascript
import { Form, Text } from 'react-savage-form';

const ExampleFormContent = (props) => {
  console.log( "FormApi:", props.formApi );
  return (
    <form onSubmit={props.formApi.submitForm} id="form1">
      <label htmlFor="hello">Hello World</label>
      <Text field="hello" id="hello" />
      <button type="submit">Submit</button>
    </form>
  );
}

const ExampleForm = ( ) => {
  return (
    <Form>
      <ExampleFormContent />
    </Form>
  );
}
```

# Examples & Documentation
Go [here](https://react-savage-form.cfapps.io) for examples and documentation.
