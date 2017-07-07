<div align="center">
  <a href="https://github.com/tannerlinsley/react-form" target="\_parent">
    <img src="https://github.com/tannerlinsley/react-form/raw/master/media/banner.png" alt="React Table Logo" style="width:550px;"/>
  </a>
  <br />
  <br />
</div>

<a href="https://travis-ci.org/tannerlinsley/react-form" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-form.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-form" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-form.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/tannerlinsley/react-form" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-form.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

React Form is a powerful and lightweight form framework for React.

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

## [Demo](https://react-form.js.org/?selectedKind=2.%20Demos&selectedStory=Kitchen%20Sink&full=0&down=0&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel)

## [Webpack-Bin](http://www.webpackbin.com/V1AI--xtz)

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [Annotated Demo Example](#annotated-demo-example)
- [Custom Input Example](#custom-input-example)
- [API](#api)
  - [{ Form }](#-form-)
  - [Props](#props)
  - [Form API](#form-api)
  - [{ FormDefaultProps }](#-formdefaultprops-)
  - [{ FormInput }](#-forminput-)
  - [{ FormError }](#-formerror-)
  - [{ FormField }](#-formfield-)
  - [Form Components](#form-components)
    - [{ Text }](#-text-)
    - [{ Select }](#-select-)
    - [{ Checkbox }](#-checkbox-)
    - [{ Textarea }](#-textarea-)
    - [{ RadioGroup, Radio }](#-radiogroup-radio-)
    - [{ NestedForm }](#-nestedform-)
<!-- - [Recipes](#recipes) -->

## Installation
```bash
$ npm install react-form
```

## Example
What does React-Form look like? This is the shortest and most concise example we could think of. Looking for more detail? Dive deep with the [Annotated Demo Example](#annotated-demo-example)
```javascript
import React from 'react'
import { Form, Text } from 'react-form'

const myForm = (
  <Form
    onSubmit={(values) => {
      console.log('Success!', values)
    }}
    validate={({ name }) => {
      return {
        name: !name ? 'A name is required' : undefined
      }
    }}
  >
    {({submitForm}) => {
      return (
        <form onSubmit={submitForm}>
          <Text field='name' />
          <button type='submit'>Submit</button>
        </form>
      )
    }}
  </Form>
)
```

## Annotated Demo Example
This is an annotated example of the demo, demonstrating a majority of React-Form's features.
```javascript
import React from 'react'
import { Form, Text, Select, Textarea, Checkbox, Radio, RadioGroup, NestedForm, FormError } from 'react-form'

const MyForm = (
  <Form
    onSubmit={(values) => {
      console.log('Success!', values)
    }}

    // Let's give the form some default values
    defaultValues={{
      friends: []
    }}

    // Validating your form is super easy, just use the `validate` life-cycle method
    validate={values => {
      const { name, hobby, status, friends, address } = values
      return {
        name: !name ? 'A name is required' : undefined,
        hobby: (hobby && hobby.length < 5) ? 'Your hobby must be at least 5 characters long' : false,
        status: !status ? 'A status is required' : null,
        friends: (!friends || !friends.length) ? 'You need at least one friend!' : friends.map(friend => {
          const { name, relationship } = friend
          return {
            name: !name ? 'A name is required' : undefined,
            relationship: !relationship ? 'A relationship is required' : undefined
          }
        }),
        address: !address ? 'A valid address is required' : 0
      }
    }}

    // `onValidationFail` is another handy form life-cycle method
    onValidationFail={() => {
      window.alert('There is something wrong with your form!  Please check for any required values and try again :)')
    }}
  >
    {({ values, submitForm, addValue, removeValue, getError }) => {
      // A Form's direct child will usually be a function that returns a component
      // This way you have access to form methods and form values to use in your component. See the docs for a complete list.
      return (
        // When the form is submitted, call the `submitForm` callback prop
        <form onSubmit={submitForm}>

          <div>
            <h6>Full Name</h6>
            <Text // This is the built-in Text formInput
              field='name' // field is a string version of the field location
              placeholder='Your name' // all other props are sent through to the underlying component, in this case an <input />
            />
          </div>

          <div>
            <h6>Relationship Status</h6>
            <Select // This is the built-in Select formInput
              field='status'
              options={[{ // You can ship it some options like usual
                label: 'Single',
                value: 'single'
              }, {
                label: 'In a Relationship',
                value: 'relationship'
              }, {
                label: 'It\'s Complicated',
                value: 'complicated'
              }]}
            />
          </div>

          <div>
            <h6>Short Bio</h6>
            <Textarea // This is the built-in Textarea formInput
              field='bio'
              placeholder='Short Bio'
            />
          </div>

          {/* Arrays in forms are super easy to handle */}
          <h6>Friends</h6>
          {/* This is a custom form error for the root of the friends list (see validation function) */}
          <FormError field='friends' />
          <div className='nested'>
            {!values.friends.length ? (
              <em>No friends have been added yet</em>
            ) : values.friends.map((friends, i) => ( // Loop over the values however you'd like
              <div key={i}>

                <div>
                  <h6>Full Name</h6>
                  <Text
                    field={['friends', i, 'name']} // You can easily pass an array-style field path. Perfect for passing down as props or nested values
                    placeholder='Friend Name'
                  />
                </div>

                <div>
                  <h6>Relationship</h6>
                  <Select
                    field={`friends.${i}.relationship`} // If you don't like arrays, you can also use a string template
                    options={[{
                      label: 'Friend',
                      value: 'friend'
                    }, {
                      label: 'Acquaintance',
                      value: 'acquaintance'
                    }, {
                      label: 'Colleague',
                      value: 'colleague'
                    }]}
                  />
                </div>

                <button // This button will remove this friend from the `friends` field
                  type='button'
                  onClick={() => removeValue('friends', i)} // `removeValue` takes a field location for an array, and the index for the item to remove
                >
                  Remove Friend
                </button>

              </div>
            ))}
          </div>

          <div>
            <button // This button will add a new blank friend item to the `friends` field
              type='button'
              onClick={() => addValue('friends', {})} // `addValue` takes an array-like field, and the value to add
            >
              Add Friend
            </button>
          </div>

          <div>
            <h6>Address</h6>
            {/* An address has a couple of parts to it, and will probably have its own validation function. */}
            {/* Let's make it reusable by using a nested form */}
            <NestedForm
              field='address' // The results of this nested form will be set to this field value on this form.
            >
              {AddressForm} // This is our reusable address form (see below)
            </NestedForm>
          </div>

          <div>
            <label>
              <Checkbox // This is the built-in checkbox formInput
                field='createAccount'
              />
              <span>Create Account?</span>
            </label>
          </div>

          <div>
            <h6>Notify me via</h6>
            <RadioGroup field="notificationType">
              <label>
                <Radio // This is the built-in radio formInput
                  value='email' // This is the value the field will be set to when this radio button is active
                />
                <span>Email</span>
              </label>
              <label>
                <Radio
                  value='text'
                />
                <span>Text</span>
              </label>
              <label>
                <Radio
                  value='phone'
                />
                <span>Phone</span>
              </label>
            </RadioGroup>
          </div>

          <br />
          <br />

          {/* // Since this is the parent form, let's put a submit button in there ;) */}
          {/* // You can submit your form however you want, as long as you call the `submitForm` callback */}
          <button>
            Submit
          </button>
        </form>
      )
    }}
  </Form>
)

// This is our reusable address form
const AddressForm = (
  <Form
    // It can have its own validation function too! This keeps our parent validation function clean and flat
    validate={values => {
      return {
        street: !values.street ? 'A street is required' : undefined,
        city: !values.city ? 'A city is required' : undefined,
        state: !values.state ? 'A state is required' : undefined
      }
    }}
  >
    // If you don't need access to any form methods or props, you can simply return JSX without wrapping it in a function
    <Text
      field='street'
      placeholder='Street'
    />
    <br />
    <Text
      field='city'
      placeholder='City'
    />
    <br />
    <Text
      field='state'
      placeholder='State'
    />
  </Form>
)
```

## Custom Input Example
Creating custom form inputs is extremely simple.  This is a quick example of how to wrap the <a href="https://github.com/JedWatson/react-select" target="\_parent">React-Select</a> component:
```javascript
// formReactSelect.js

import React from 'react'
import { FormInput } from 'react-form'
import Select from 'react-select'

export default ({field, ...rest}) => {
  return (
    <FormInput field={field}> // Use FormInput with a fieldName to get the field's api
      // FormInput's only child should be a function that provides you the field api and returns valid jsx or a react component
      {({ setValue, getValue, setTouched }) => {
        return (
          <Select
            {...rest} // Send the rest of your props to React-Select
            value={getValue()} // Set the value to the forms value
            onChange={val => setValue(val)} // On Change, update the form value
            onBlur={() => setTouched()} // And the same goes for touched
          />
        )
      }}
    </FormInput>
  )
}

// Now you can use it in a form!
import React from 'react'
import FormReactSelect from './formReactSelect'

const myForm = (
  <Form>
    <FormReactSelect
      field='my.field'
      clearable={false}
      options={[...]}
    />
  </Form>
})

```

# API

### { Form }
- Props
  - defaultValues {}
  - loadState ()
  - preValidate ()
  - validate ()
  - onValidationFail ()
  - onChange ()
  - saveState ()
  - willUnmount ()
  - preSubmit ()
  - onSubmit ()
  - postSubmit ()
- Child can be either:
  - A function that returns a component (**this function is called with an object that contains:**)
    - Current [Form State](#form-state)
    - [Form API methods](#form-api-methods)
    - Any other props passed to your form component
  - A component or JSX (if you do not need access to any methods or form state)

**Example**
```javascript
import { Form } from 'react-form'

// Create a new form by passing `Form` and Form props
const myForm = (
  <Form
    onSubmit={}
    validate={() => {...}}
    // any other props
  >
    ...
  </Form>
```

---

## Props
Everything in react-form is configurable with the following props.
*Note: You can also change the default props for every form component via `FormDefaultProps` (See [{FormDefaultProps}](#-formdefaultprops-))*

#### defaultValues {}
- To hardcode any default values to the form, just pass them in an object here.
- Example:
```javascript
<Form
  defaultValues={{
    name: 'Tanner Linsley'
    hobby: 'javascript'
  }}
>
```

#### loadState (props, instance)
- When a form mounts, `loadState` is called. If a saved [form state object](#form-state) is returned, it will hydrate the form state from this object.
- An ideal callback to load the form state from an external state manager (Redux/MobX/other)

#### preValidate (values, state, props, instance)
- This method is a value filter that happens before each validation.
- Use it to scrub and/or clean your values before they are validated.
- Whatever you return will replace all of the values in that form's state.
- Example:
```javascript
<Form
  preValidate={(values) => {
    values.hobby = values.hobby.substring(0, 6) // Constantly scrub the hobby field to never be more than 6 characters long
    return values
  }}
>
```

#### validate (values, state, props, instance)
- Using the current values, you may return an object of error strings that map 1:1 to any fields that do not meet any condition you specify
- Any falsey errors will be recursively stripped from the object you return, so if a field is valid, simply return a falsey value of your choice.
- If attempting to submit, and `validate` returns any errors, `setAllTouched(true)` will automatically be called on the form. Likewise, if the form has been marked as globally dirty, and no errors are returned, `setAllTouched(false)` will automatically clear the global dirty state
- Example:
```javascript
<Form
  validate={({name, password}) => {
    return {
      name: !name ? 'A name is required' : null,
      password: (!password || password.length < 6) ? 'A password of 6 or more characters is required' : null
    }
  }}
>
```

#### onValidationFail (values, state, props, instance)
- If and when a forms validation fails, you can handle it here

#### onChange (state, props, initial, instance)
- Called any time a form's `values` change
- If `initial` is set to true, this indicates that the component just mounted and is firing `onChange` for the first time (this is utilized by nested forms)

#### saveState (state, props, instance)
- Called anytime a form's internal `state` is changed.
- An ideal callback to export/save the [form state](#form-state) from an external state manager (Redux/MobX/other)

#### willUnmount (state, props, instance)
- Called when a form is about to unmount
- An ideal callback to remove the [form state](#form-state) from an external state manager (Redux/MobX/other)

#### preSubmit (values, state, props, instance)
- This method is a value filter that happens after validation and before a successful submission.
- Use it to scrub and/or clean your values before they are submitted.
- Whatever you return will **not** replace all of the values in that form's state, but will be passed to the `onSubmit` method.
- Example:
```javascript
<Form
  preSubmit={(values) => {
    values.hobby = values.hobby.toLowerCase() // Scrub the hobby field to be lowercase on submit
    return values
  }}
>
```

#### onSubmit (values, state, props, instance)
- When a form is successfully submitted via [`submitForm`](#submitform-), this method will be called with the values of the parent form.
- Example:
```javascript
// Per Instance (usually this way)
<Form
  onSubmit={(values) => {
    console.log('Form Submitted with these values:', values)
  }}
/>
```

#### postSubmit (values, state, props, instance)
- After a form is successfully submitted via `submitForm`, this method will be called.
- Example:
```javascript
<Form
  postSubmit={(values) => {
    console.log('Success!', values)
  }}
>
```

#### component (string / component / false)
- If truthy, the form will use the tag or component as the root for the form.
- If falsey, the form will not be wrapped and you must return a single element from your form's children or render function
- Defaults to 'div'
- If using a custom component, make sure to pass through all props, including `children` for your form to render correctly
- Example:
```javascript
<Form
  component={props => (
    <CustomComponent {...props} />
  )}
>
```

---

## Form API
When a function is passed as the child of a form, it is passed the form API as a parameter. eg.
```javascript
<Form>
  {(api) => {
    ...
  }}
</Form>
```
This also makes it extremely easy to destructure exactly what you need from the api!
```javascript
<Form>
  {({submitForm, values, addValue, removeValue}) => {
    ...
  }}
</Form>
```

The form API is a merge of the form state object and API methods

### Form State

#### values {}
- The current read-only values in the form state.
- Again, these values are immutable, so just like any traditional react state or redux state, they should not be changed or mutated outside of the form lifecycle methods
- Example:
```javascript
<Form>
  {({values}) => {
    console.log(values)
    // {
    //   name: 'Tanner Linsley',
    //   hobby: 'Javascript',
    //   nestedForm: {
    //     notes: 'These are some notes from a nested form'
    //   }
    // }
  }}
</Form>
```

#### errors {}
- The current read-only errors in the form state.
- This prop is not recommended for displaying errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- Errors are set via the optional `validate` lifecycle method
- Defaults to `null`
- Example:
```javascript
<Form>
  {({errors}) => {
    console.log(errors)
    // {
    //   name: 'Name is required and must be at least 5 characters',
    //   hobby: 'Required',
    //   nestedForm: 'Requires some valid nested fields' // See "nestedErrors" section
    // }
  }}
</Form>
```

#### nestedErrors {}
- The current read-only nested form errors in the form state
- `nestedErrors` is an object map indicating any nested forms that did not pass their own validation
- This prop is not recommended for displaying nested form errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- If a nested form contains an error in its own validation lifecycle method, its corresponding `nestedErrors` field will be set to true.
- Defaults to `{}`
- Example:
```javascript
<Form>
  {({nestedErrors}) => {
    console.log(nestedErrors)
    // {
    //   nestedForm: true // there must be an error in the form located at the "nestedForm" field
    // }
  }}
</Form>
```

#### touched {}
- The current read-only touched fields map in the form state
- When a field is changed via `setValue()` or `setTouched()`, its corresponding field location in this object is marked as true.
- This props is not recommended for displaying errors. For that, we recommend relying on a `FormInput` or using the `FieldError` component.
- Defaults to `{}`
- Example:
```javascript
<Form>
  {({touched}) => {
    console.log(touched)
    // {
    //   touched: { myField: true } // the `myField` field has been touched
    // }
  }}
</Form>
```

### Form API methods

#### setAllValues (values, noTouch)
- Sets (replaces) all form values to `values`
- If `noTouch` is true, the `touched` state of the field won't change.
- Example:
```javascript
<Form>
  {({setAllValues}) => {
    return (
      <button onClick={() => setAllValues({
        name: 'Tanner Linsley',
        job: 'Software Developer',
        age: 27
      })}>
        Set all field values
      </button>
    )
  }}
</Form>
```

#### setValue (field, value, noTouch)
- Sets any given `field` to `value`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- The field will be created if it does not exist and will automatically infer object/array structure from field location
- If `noTouch` is true, the `touched` state of the field won't change.
- Example:
```javascript
<Form>
  {({setValue}) => {
    return (
      <button onClick={() => setValue('some.field', true)}>
        Set Some Field to TRUE
      </button>
    )
  }}
</Form>
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
<Form>
  {({getValue}) => {
    return (
      <span>Current Value: {getValue('my.field')}</span>
    )
  }}
</Form>
```

#### setNestedError (field, value)
- Mostly used internally, this method sets the `field` in `nestedErrors` to `value` to indicate that a nested form did or did not not pass its own validation.
- If a nested form error is set, its value in its parent `validate` lifecycle method will be set to undefined.
- This is necessary to check if a nested form is valid from a the parent form's `validate` lifecycle method.
- For example usage, see the source for the <a href="https://github.com/tannerlinsley/react-form/blob/master/src/formInputs/form.js" target="\_parent">`NestedForm` component</a>

#### getError (field)
- Gets the current error located at `field`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({getError}) => {
    return (
      <span>Current Error: {getError('my.field')}</span>
    )
  }}
</Form>
```

#### setTouched (field, value = true)
- Sets the `field` in the `touched` state to `value` (which defaults to true). Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({setTouched}) => {
    return (
      <button onClick={() => setTouched('some.field', true)}>
        Set some fields touched value to TRUE
      </button>
    )
  }}
</Form>
```

#### getTouched (field)
- Gets the current touched value for `field`. Usually this functionality is contained in an InputField of sorts, but it is still available on the form itself in its generic form.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({getTouched}) => {
    return (
      <span>Current Touched: {getTouched('my.field')}</span>
    )
  }}
</Form>
```


#### addValue (field, value)
- Pushes `value` into an **array-like** `field` as a new value.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({addValue}) => {
    return (
      <button onClick={() => addValue('todos', {})}>
        Add Todo
      </button>
    )
  }}
</Form>
```

#### removeValue (field, index)
- Removes the field at the specified index from an **array-like** `field`.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({removeValue}) => {
    return (
      <div>
        {todos.map((todo, i) => {
          return (
            <button onClick={() => removeValue('todos', i)}>
              Remove Todo
            </button>
          )
        })}
      </div>
    )
  }}
</Form>
```

#### swapValues (field, i, j)
- Swaps the fields at the specified indices inside an **array-like** `field`.
- `field` can be a **string or array property location** eg.
  - `my.field.name` == `['my', 'field', 'name']`
  - `my.fields[3]` == `['my', 'fields', 3]`
  - Array properties can also be nested (great for passing down via props) `[['my', 'fields'], [5], 'stuff']` == `my.fields[5].stuff`
- Example:
```javascript
<Form>
  {({swapValues}) => {
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
  }}
</Form>
```

#### setAllTouched (value = true)
- Sets the form's `dirty` state to `!!value` (which defaults to `true`). If `true`, its value will override any value retrieved using `getTouched`.
- When set to true, all validation errors in a form will be visible regardless if they are touched.
- Used internally by the `submitForm` lifecycle method when a forms validation is failed
- Example:
```javascript
<Form>
  {({setAllTouched}) => {
    return (
      <button onClick={setAllTouched}>
        Touch / Dirty the entire form // innuendo? hmm....
      </button>
    )
  }}
</Form>
```

#### resetForm ()
- Resets all of the values of the form back to it's default values.
- Example:
```javascript
<Form>
  {({resetForm}) => {
    return (
      <button onClick={resetForm}>
        Start over!
      </button>
    )
  }}
</Form>
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
<Form
  onSubmit={(values, state, props) => {
    console.log(values)
  }}
>
  {({submitForm}) => {
    return (
      <form onSubmit={submitForm}>
        <button type='submit'>Submit Form</button>
      </form>
    )
  }}
</Form>
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
- If the `errorProps` props is present, this object's properties will be forwarded to the underlying `FormError` component used in `FormInput`

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

## Form Components
React-Form ships with plenty of standard form components and even provides an extremely easy way to create your own custom form components

### { Text }
### { Select }
### { Checkbox }
### { Textarea }
### { RadioGroup, Radio }
- These are all pre-packaged form inputs created with our very own `FormInput` component.
- Each requires a `field` prop to be passed
- All other props will be passed through to the underlying input component
- Automatically show errors and receive error classes (.-has-error). Set the `showErrors` prop to `false` to disable
- To display the error before the component, set the `errorBefore` prop to `true`
- Their source serves as great example of how to create your own custom Form Inputs
- Pass `noTouch` to avoid validation while the value is changing
- You may pass onBlur and onChange functions to augment their behaviour. Your function will be called with the event and the original function which you may choose to call. Radio does not have an onChange handler but you may augment the onClick handler in the same fashion.

**Example**
```javascript
import { Text, Select, Checkbox, Textarea, Radio, RadioGroup } from 'react-form'

const example = (
  <div>

    <Text
      onChange={(e, onChange) => {
        console.log('it changed')
        onChange()
      }}
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

    <RadioGroup field='notificationType'>
      <Radio value='email'/>
      <Radio value='text'/>
      <Radio value='phone'/>
    </RadioGroup>

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
- `$ yarn`
- `$ yarn run storybook`
- Implement your changes to files in the `src/` directory
- View changes as you code via our <a href="https://github.com/storybooks/react-storybook" target="\_parent">React Storybook</a> `localhost:8000`
- Make changes to stories in `/stories`, or create a new one if needed
- Submit PR for review

#### Scripts

- `$ yarn run storybook` Runs the storybook server
- `$ yarn run test` Runs the test suite
- `$ yarn run prepublish` Builds the distributable bundle
- `$ yarn run docs` Builds the website/docs from the storybook for github pages

## Used By

<a href='https://nozzle.io' target="\_parent">
  <img src='https://nozzle.io/img/logo-blue.png' alt='Nozzle Logo' style='width:300px;'/>
</a>
