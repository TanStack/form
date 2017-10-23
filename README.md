# React-Form
A powerful and lightweight form library for React.

### Go to [live examples, code and docs](https://react-form.js.org)!

[![Build Status](https://travis-ci.org/react-tools/react-form.svg?branch=v0.11.1)](https://travis-ci.org/react-tools/react-form)

# Intro
Say hello to the best react form library you have ever used! `react-form` is an extensive, simple, and efficient solution for creating simple to complex forms in react. Out of the box you get the ability to grab and manipulate values; set errors, warnings, and successes; customize your inputs, perform asynchronous validation, and much more! If you want to check out the cool stuff and how to use this library, head over to the docs [here](https://react-form.js.org).

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
Go [here](https://react-form.js.org) for examples and documentation for **2.x.x** of React-Form.

Older versions:
* [Version 1.x.x](https://github.com/react-tools/react-form/tree/v1.3.0)
