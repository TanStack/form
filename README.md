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
- [Quick Example](#quick-example)
- [API](#api)
  - [{ Form }](#-form-)
  - [Default Props & Form Lifecycle](#default-props--form-lifecycle)
  - [Form Component Props](#form-component-props)
  - [{ FormDefaultProps }](#-formdefaultprops-)
  - [{ FormInput }](#-forminput-)
  - [{ FormError }](#-formerror-)
  - [{ FormField }](#-formfield-)
  - [{ Text, Select, Checkbox, Textarea }](#-text-select-checkbox-textarea-)
  - [{ NestedForm }](#-nestedform-)
<!-- - [Recipes](#recipes) -->

<a name="installation"></a>
## Installation
```bash
$ npm install tl-react-form
```

<a name="example"></a>
## Quick Example
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

# API

### { Form }
- Usage: `Form(defaultPropsAndLifecycleMethods)(component)`
- Returns a new react-form component
- Call it first with any default props for your form. **This includes lifecycle methods, validation, etc**
- Call it again with the react component that will render the form.
- The React Component you provide will receive the following as props:
  1. Current Form State
  1. Form API methods
  1. Finally, any other props passed to your form component

**Example**
```javascript
import { Form } from 'react-form'

// Create a new form by passing `Form` any default props and/or lifecycle methods
const myForm = Form({
  validate () {...},
})(validReactComponent)) // Then pass in any valid react component, component class or stateless component
```

---

## Default Props & Form Lifecycle
The form lifecycle is what makes React-Form tick, so naturally you can configure just about anything in react-form to your needs through these lifecycle methods.

You can define form props and lifecycle methods at 3 different levels:
1. Globally via `FormDefaultProps` (See [{FormDefaultProps}](#-formdefaultprops-))
1. Per form by passing `defaultProps` to `Form`
1. Per instance by using a standard react prop when rendering the form.

Here is a list of all available properties and lifecycle methods that React-Form uses:

#### defaultValues {}
- To hardcode any default values to the form, just pass them in an object here.
- Example:
```javascript
Form({
  defaultValues: {
    name: 'Tanner Linsley'
    hobby: 'javascript'
  }
})(component)
```

#### loadState (props)
- When a form mounts, `loadState` is called. If a saved form state object is returned, it will hydrate the form state from this object.
- An ideal callback to load the form state from an external state manager (Redux/MobX/other)

#### preValidate (values, state, props)
- This method is a value filter that happens before each validation.
- Use it to scrub and/or clean your values before they are validated.
- Whatever you return will replace all of the values in that form's state.
- Example:
```javascript
Form({
  preValidate: (values) => {
    values.hobby = values.hobby.substring(0, 6) // Constantly scrub the hobby field to never be more than 6 characters long
    return values
  }
})(component)
```

#### validate (values, state, props)
- Using the current values, you may return an object of error strings that map 1:1 to any fields that do not meet any condition you specify
- Any falsey errors will be recursively stripped from the object you return, so if a field is valid, simply return a falsey value of your choice.
- If attempting to submit, and `validate` returns any errors, `setAllTouched(true)` will automatically be called on the form. Likewise, if the form has been marked as globally dirty, and no errors are returned, `setAllTouched(false)` will automatically clear the global dirty state
- Example:
```javascript
Form({
  validate: ({name, password}) => {
    return {
      name: !name ? 'A name is required' : null,
      password: (!password || password.length < 6) ? 'A password of 6 or more characters is required' : null
    }
  }
})(component)
```

#### onValidationFail (values, state, props)
- If and when a forms validation fails, you can handle it here

#### onChange (state, props, initial)
- Called any time a form's `values` change
- If `initial` is set to true, this indicates that the component just mounted and is firing `onChange` for the first time (this is utilized by nested forms)

#### saveState (state, props)
- Called anytime a form's internal `state` is changed.
- An ideal callback to export/save the form state from an external state manager (Redux/MobX/other)

#### willUnmount (state, props)
- Called when a form is about to unmount
- An ideal callback to remove the form state from an external state manager (Redux/MobX/other)

#### preSubmit (state, props)
- This method is a value filter that happens after validation and before a successful submission.
- Use it to scrub and/or clean your values before they are submitted.
- Whatever you return will **not** replace all of the values in that form's state, but will be passed to the `onSubmit` method.
- Example:
```javascript
Form({
  preSubmit: (values) => {
    values.hobby = values.hobby.toLowerCase() // Scrub the hobby field to be lowercase on submit
    return values
  }
})(component)
```

#### onSubmit (values, state, props)
- When a form is submitted via `submitForm`, this method will be called **only if validation succeeds**.
- Example:
```javascript
Form({
  preSubmit: (values) => {
    values.hobby = values.hobby.toLowerCase() // Scrub the hobby field to be lowercase on submit
    return values
  }
})(component)
```

#### postSubmit (values, state, props)
- After a form is successfully submitted via `submitForm`, this method will be called.
- Example:
```javascript
Form({
  postSubmit: (values) => {
    console.log('Success!', values)
  }
})(component)
```

#### Other Custom Default Props
- Any other properties passed in a forms `defaultProps` will function as hardcoded defaultProps. They will be available on the componentused to render the form unless overridden by a prop passed tot he instance

---

## Form Component Props
All of the following props are available on the component used to render your form

*Note: If a prop of the same name is passed to the form instance, it will override these props below.*

#### values {}
- The current read-only values in the form state.
- Again, these values immutable, so just like any traditional react state or redux state, they should not be changed or mutated outside of the form lifecycle methods
- Example:
```javascript
Form()(
  ({values}) => {
    console.log(values)
    // {
    //   name: 'Tanner Linsley',
    //   hobby: 'Javascript',
    //   nestedForm: {
    //     notes: 'These are some notes from a nested form'
    //   }
    // }
  }
)
```

#### errors {}
- The current read-only errors in the form state.
- This prop is not recommended for displaying errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- Errors are set via the optional `validate` lifecycle method
- Defaults to `null`
- Example:
```javascript
Form()(
  ({errors}) => {
    console.log(errors)
    // {
    //   name: 'Name is required and must be at least 5 characters',
    //   hobby: 'Required',
    //   nestedForm: 'Requires some valid nested fields' // See "nestedErrors" section
    // }
  }
)
```

#### nestedErrors {}
- The current read-only nested form errors in the form state
- `nestedErrors` is an object map indicating any nested forms that did not pass their own validation
- This prop is not recommended for displaying errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- If a nested form contains an error in its own validation lifecycle method, its corresponding `nestedErrors` field will be set to true.
- Defaults to `{}`
- Example:
```javascript
Form()(
  ({nestedErrors}) => {
    console.log(nestedErrors)
    // {
    //   nestedForm: true // there must be an error in the form located at the "nestedForm" field
    // }
  }
)
```

#### touched {}
- The current read-only touched fields map in the form state
- When a field is changed via `setValue()` or `setTouched()`, its corresponding field location in this object is marked as true.
- This props is not recommended for displaying errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- Defaults to `{}`
- Example:
```javascript
Form()(
  ({nestedErrors}) => {
    console.log(nestedErrors)
    // {
    //   nestedForm: true // there must be an error in the form located at the "nestedForm" field
    // }
  }
)
```

#### setValue (field, value, noTouch)
- Sets any given `field` to `value`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- The field will be created if it does not exist and will automatically infer object/array structure from field location
- Example:
```javascript
Form()(
  ({setValue}) => {
    return (
      <button onClick={() => setValue('some.field', true)}>
        Set Some Field to TRUE
      </button>
    )
  }
)
```

#### getValue (field, fallback)
- Gets the current value located at `field`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- You can pass a `fallback` value which will be used if the field does not exist or if its `value === undefined`
- Example:
```javascript
Form()(
  ({getValue}) => {
    return (
      <span>Current Value: {getValue('my.field')}</span>
    )
  }
)
```

#### setNestedError (field, value)
- Mostly used internally, this method sets the `field` in `nestedErrors` to `value` to indicate that a nested form did or did not not pass its own validation.
- If a nested form error is set, its value in its parent `validate` lifecycle method will be set to undefined.
- This is necessary to check if a nested form is valid from a the parent form's `validate` lifecycle method.
- For example usage, see the source for the [`NestedForm` component](https://github.com/tannerlinsley/react-form/blob/master/src/formInputs/form.js)

#### getError (field)
- Gets the current error located at `field`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({getError}) => {
    return (
      <span>Current Error: {getError('my.field')}</span>
    )
  }
)
```

#### setTouched (field, value = true)
- Sets the `field` in the `touched` state to `value` (which defaults to true). Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({setTouched}) => {
    return (
      <button onClick={() => setTouched('some.field', true)}>
        Set some fields touched value to TRUE
      </button>
    )
  }
)
```

#### getTouched (field)
- Gets the current touched value for `field`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({getTouched}) => {
    return (
      <span>Current Touched: {getTouched('my.field')}</span>
    )
  }
)
```


#### addValue (field, value)
- Pushes `value` into an **array-like** `field` as a new value.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({addField}) => {
    return (
      <button onClick={() => addField('todos', {})}>
        Add Todo
      </button>
    )
  }
)
```

#### removeValue (field, index)
- Removes the field at the specified index from an **array-like** `field`.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({removeField}) => {
    return (
      <div>
        {todos.map((todo, i) => {
          return (
            <button onClick={() => removeField('todos', i)}>
              Remove Todo
            </button>
          )
        })}
      </div>
    )
  }
)
```

#### swapValues (field, i, j)
- Swaps the fields at the specified indices inside an **array-like** `field`.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
Form()(
  ({swapValues}) => {
    return (
      <div>
        {todos.map((todo, i) => {
          return (
            <button onClick={() => swapValues('todos', i, i - 1)}>
              Move Up
            </button>
          )
        })}
      </div>
    )
  }
)
```

#### setAllTouched (value = true)
- Sets the form's `dirty` state to `!!value` (which defaults to `true`). If `true`, its value will override any value retrieved using `getTouched`.
- When set to true, all validation errors in a form will be visible regardless if they are touched.
- Used internally by the `submitForm` lifecycle method when a forms validation is failed
- Example:
```javascript
Form()(
  ({setAllTouched}) => {
    return (
      <button onClick={setAllTouched}>
        Touch / Dirty the entire form // innuendo? hmm....
      </button>
    )
  }
)
```

#### submitForm ()
- Submits the form with the following optional lifecycle events:
  - `preValidate(values, state, props)` filter your values before they are validated
  - `validate(values, state, props)` validate your form
  - `onValidationFail(state, props)` handle failed validation (if applicable)
  - `preSubmit(values, state, props)` filter your values before they are successfully submitted
  - `onSubmit(values, state, props)` handle the submission
  - `postSubmit(values, state, props)` handle after a successful submission
- Example:
```javascript
const MyForm = Form()(
  ({submitForm}) => {
    return (
      <form onSubmit={submitForm}>
        <button type='submit'>Submit Form</button>
      </form>
    )
  }
)

const usageExample = () => {
  return (
    <MyForm
      onSubmit={(values, state, props) => {
        console.log(values)
      }}
    />
  )
}
```

---

### { FormDefaultProps }
- An object of the global default props for every react-form you create.
- You can assign new global defaults to this object anywhere before creating a new react-form
- Example:
```javascript
import { FormDefaultProps } from 'react-form'

Object.assign(FormDefaultProps, {
  onValidationFail: () => { console.log('uh oh...') }
})
```

### { FormInput }
- A higher-order component to create new input types quickly.
- Automatically shows errors and receives error classes (.-has-error) for the field given
- The only child of `FormInput` must be a function that returns valid JSX. This function is passed one parameter, the form api object.
- The form api object contains every method to manage the form's state.
- If a `field` prop is passed, every API method will be auto-bound to use that `field`. Otherwise, they operate at the form-level as usual.
- If the `showErrors` prop is set to `false`, errors will be hidden
- If the `errorBefore` prop is set to `true`, any error will be shown before the component, instead of after
- If the `isForm` props is set to `true`, the field error will only be shown if the parent form has been unsuccessfully submitted. This is normally only used for `NestedForm` components to avoid unnecessary or duplicate error messages.

**Example** - A simple wrapper for React Select
```javascript
import { FormInput } from 'react-form'
import ReactSelect from 'react-select'

export default ({field, ...rest}) => {
  return (
    <FormInput field={field}>
      {({ setValue, getValue, setTouched }) => {
        return (
          <ReactSelect
            {...rest}
            value={getValue()}
            onChange={val => setValue(val)}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
```

### { FormError }
- Displays an error message for the given field
- Will only display if both an error for that field exists and it has been touched.

**Example**
```javascript
import { FormError } from 'react-form'

const example = (
  <FormError field='my.field' />
)
```

### { FormField }
- A low-level react component that can be used anywhere within a form to expose the api for any field.
- The only child of `FormField` must be a function that returns valid JSX. This function is passed one parameter, the form api object.
- The form api object contains every method to manage the form's state.
- If a `field` prop is passed, every API method will be auto-bound to use that field. Otherwise, they operate at the form-level as usual.

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

### { Text, Select, Checkbox, Textarea }
- These are all pre-packaged form inputs created with our very own `FormInput` component.
- Each requires a `field` prop to be passed
- All other props will be passed through to the underlying input component
- Automatically show errors and receive error classes (.-has-error)
- Their source serves as great example of how to create your own custom Form Inputs

**Example**
```javascript
import { Text, Select, Checkbox, Textarea } from 'react-form'

const example = (
  <div>

    <Text
      field='name'
      placeholder='Full name'
    />

    <Select
      field='employed'
      options={[{
        label: 'Employed',
        values: true
      }, {
        label: 'Unemployed',
        value: false
      }]}
    />

    <Checkbox
      field='createAccount'
    />

    <Textarea
      field='notes'
      placeholder='Notes'
    />

  </div>
)
```

### { NestedForm }
- React forms can be composed and nested at any depth or level of granularity and each nested form has it's own unique lifecycle. This can be extremely useful for avoiding large or deep validation functions, or breaking up complex forms.
- Nested forms propagate their values as an `object` to their assigned field on their parent form.
- Invalid nested forms pass `undefined` to their parent's validation function in place of the nested form's values. For instance, if a nested form using the field `myNestedForm` has an error, the parent validation function might look like this:
```javascript
  validate ({name, hobby, myNestedForm}) {
    return {
      // normal validation...
      myNestedForm: !myNestedForm ? 'Name Required' : undefined,
    }
  }
```
- Nested forms cannot be submitted on their own and cannot use nested `<Form />` elements (which would be invalid HTML).
- Nested forms perform all of the standard form lifecycle methods except for those that are submission related
  - `onValidationFail`
  - `preSubmit`
  - `onSubmit`

---

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
