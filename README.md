# We Have Moved!

## This library is no longer supported and has been rewritten from scratch as `informed`!

### Documentation: [HERE](https://joepuzzo.github.io/informed)
### NPM: [HERE](https://www.npmjs.com/package/informed)

[![Informed-Chat](https://img.shields.io/badge/slack-informed--chat-blue.svg)](https://spectrum.chat/informed)

## Why Move?? How could you do this to me?

DON'T FRET!

`react-form` became two large and bloated to maintain. We wanted a fresh start where we could cover the 90% use case
and also purge the library of unnecessary dependencies such as Redux. Informed is completely from scratch, but it keeps
almost the exact same interface, so migration is very simple!

### Key considerations that were made when rewriting:

1. Test coverage! When writing informed we focused heavily on test coverage. Therefore informed is very stable.
2. Simplicity! We wanted a simpler interface that allowed developers to get up and running quicker.
3. Efficiency! Informed focuses on efficient rendering, so you can scale your forms easily.
4. 90% usecase. Informed has most of the bells and whistles that `react-form` had, however, in order to create a more stable library, we wanted to focus on providing a library that could support the 90% usecase. So we got rid of a few things that we decided could be up to the developer.

## Migration

We are currently working on migration docs but for now please look at the [Changelog.md](https://github.com/joepuzzo/informed/blob/master/CHANGELOG.md).

---

# React-Form
Simple, powerful, highly composable forms in React

### Go to [live examples, code and docs](https://react-form.js.org)!

[![Build Status](https://travis-ci.org/react-tools/react-form.svg?branch=master)](https://travis-ci.org/react-tools/react-form)
[![npm version](https://img.shields.io/npm/v/react-form.svg)](https://www.npmjs.com/package/react-form)
[![npm downloads](https://img.shields.io/npm/dm/react-form.svg)](https://www.npmjs.com/package/react-form)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/react-tools/react-form/blob/master/LICENSE)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/react-form)

# Features
- 🚀 Lightweight and fast.
- 🔥 Built-in input primitives for building quickly.
- ⚖️ Scales from tiny to massively complex forms with ease.
- 🚚 Easily integrate with 3rd party components or build your own!
- ✍️ Nested Fields and ultra-composable syntax for complex form shapes.
- ⏲ Asynchronous validation
- 🎛 Simple API that supports manipulating values, errors, warnings, and successes
- 👉 Render Props!
- 😂 Works in IE (with a polyfill or two)

## Questions? Ideas? Chat with us!
Sign up for the [React-Tools Slack Org](https://react-chat-signup.herokuapp.com/)!

### Installation
`npm install --save react-form`

### Basic Usage
```javascript
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from 'react-form';

const ExampleForm = () => (
  <Form render={({
    submitForm
  }) => (
    <form onSubmit={submitForm}>
      <Text field="firstName" placeholder='First Name' />
      <Text field="lastName" placeholder='Last Name' />
      <RadioGroup field="gender">
        <Radio value="male" />
        <Radio value="female" />
      </RadioGroup>
      <TextArea field="bio" />
      <Checkbox field="agreesToTerms" />
      <button type="submit">Submit</button>
    </form>
  )} />
)
```

### Array and Data-driven fields
```javascript

import { Form, Text } from "react-form";

const ExampleForm = () => (
  <Form
    render={({ submitForm, values, addValue, removeValue }) => (
      <form onSubmit={submitForm}>
        <Text field="firstName" placeholder="First Name" />
        <Text field="lastName" placeholder="Last Name" />
        <div>
          Friends
          {values.friends &&
            values.friends.map((friend, i) => (
              // Loop over the friend values and create fields for each friend
              <div>
                <Text
                  field={["friends", i, "firstName"]}
                  placeholder="First Name"
                />
                <Text
                  field={["friends", i, "lastName"]}
                  placeholder="Last Name"
                />
                // Use the form api to add or remove values to the friends array
                <button type="button" onClick={() => removeValue("friends", i)}>
                  Remove Friend
                </button>
              </div>
            ))}
          // Use the form api to add or remove values to the friends array
          <button type="button" onClick={() => addValue("friends", {})}>Add Friend</button>
        </div>
        <button type="submit">Submit</button>
      </form>
    )}
  />
);
```

### Advanced Field reuse, and Nested Fields
```javascript
import { Form, FormApi, NestedField, Text } from "react-form"

// Reuse The user fields for the user and their friends!
const UserFields = () => (
  <div>
    <Text field="firstName" placeholder="First Name" />
    <Text field="lastName" placeholder="Last Name" />
  </div>
)

const ExampleForm = () => (
  <Form
    onSubmit={values => console.log(values)}
    render={({ submitForm, values, addValue, removeValue }) => (
      <form onSubmit={submitForm}>
        <UserFields />
        <NestedField
          field="friends"
          render={() => (
            // Create a new nested field context
            <div>
              Friends
              {values.friends &&
                values.friends.map((friend, i) => (
                  <div key={i}>
                    <NestedField
                      field={i}
                      render={() => (
                        <UserFields /> // Now the user fields will map to each friend!
                      )}
                    />
                    <button type="button" onClick={() => removeValue("friends", i)}>
                      Remove Friend
                    </button>
                  </div>
                ))}
              <button type="button" onClick={() => addValue("friends", {})}>
                Add Friend
              </button>
            </div>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    )}
  />
)
```

### Examples & Documentation
[Visit react-form.js.org](https://react-form.js.org) for examples and documentation for **3.x.x** of React-Form.

Older versions:
* [Version 2.x.x](https://dazzling-keller-a8107a.netlify.com)
* [Version 1.x.x](https://github.com/react-tools/react-form/tree/v1.3.0)
