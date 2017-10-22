# A powerful and lightweight form library for React.

[![Build Status](https://travis-ci.org/joepuzzo/react-savage-form.svg?branch=master)](https://travis-ci.org/joepuzzo/react-savage-form)

# Intro
Say hello to the best react form library you have ever used! `react-form` is an extensive, simple, and efficient solution for creating simple to complex forms in react. Out of the box you get the ability to grab and manipulate values; set errors, warnings, and successes; customize your inputs, perform asynchronous validation, and much more! If you want to check out the cool stuff and how to use this library, head over to the docs [here](https://react-savage-form.cfapps.io).

# Motivation
Simplicity and efficiency. This form works in IE! and its fast!
There are many other libraries that exist, but they don't function in
IE and, can get pretty complex. You can create very complex forms quickly,
with only a few lines of code.

# Installation
`npm install --save react-form`

# Basic usage
```javascript
import { Form, Text } from 'react-form';

const ExampleForm = ( ) => {
  return (
    <Form>
    { formApi => (
      <form onSubmit={formApi.submitForm} id="form1">
        <label htmlFor="hello">Hello World</label>
        <Text field="hello" id="hello" />
        <button type="submit">Submit</button>
      </form>
    )}
    </Form>
  );
}
```

# Examples & Documentation
Go [here](https://react-savage-form.cfapps.io) for examples and documentation.
