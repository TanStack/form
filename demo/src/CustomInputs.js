/* ------------- Imports -------------- */
import React, { Component } from 'react'
import { PrismCode } from 'react-prism'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, Field } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const Message = ({ color, message }) => (
  <div className="mb-4" style={{ color }}>
    <small>{message}</small>
  </div>
)


const validate = value => ({
  error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
  warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
  success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
})

const CustomText = props => (
  <Field validate={validate} field={props.field}>
    { fieldApi => {

      // Remember to pull off everything you dont want ending up on the <input>
      // thats why we pull off onChange, onBlur, and field
      // Note, the ...rest is important because it allows you to pass any
      // additional fields to the internal <input>.
      const { onChange, onBlur, field, ...rest } = props

      const { value, error, warning, success, setValue, setTouched } = fieldApi

      return (
        <div>
          <input
            {...rest}
            value={value || ''}
            onChange={e => {
              setValue(e.target.value)
              if (onChange) {
                onChange(e.target.value, e)
              }
            }}
            onBlur={e => {
              setTouched()
              if (onBlur) {
                onBlur(e)
              }
            }}
          />
          {error ? <Message color="red" message={error} /> : null}
          {!error && warning ? <Message color="orange" message={warning} /> : null}
          {!error && !warning && success ? <Message color="green" message={success} /> : null}
        </div>
      )
    }}
  </Field>
)

const FormContent = () => (
  <Form >
    { formApi => (
      <div>
        <form onSubmit={formApi.submitForm} id="form5">
          <label htmlFor="firstName4">First name</label>
          <Text field="firstName" id="firstName4" />
          <label htmlFor="hello2">Custom hello world</label>
          <CustomText field="hello" id="hello2" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
        <br />
        <Data title="Values" reference="formApi.values" data={formApi.values} />
        <Data title="Errors" reference="formApi.errors" data={formApi.errors} />
        <Data title="Warnings" reference="formApi.warnings" data={formApi.warnings} />
        <Data title="Successes" reference="formApi.success" data={formApi.successes} />
      </div>
    )}
  </Form>
)

const CustomFormCode = () => {
  const code = `
  import { Form, Text, Field } from '../../src';

  const Message = ({ color, message }) => (
    <div className="mb-4" style={{ color }}>
      <small>{message}</small>
    </div>
  )


  const validate = value => ({
    error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
    warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
    success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
  })

  const CustomText = props => (

    // Use the form field and your custom input together to create your very own input!
    <Field validate={validate} field={props.field}>
      { fieldApi => {

        // Remember to pull off everything you dont want ending up on the <input>
        // thats why we pull off onChange, onBlur, and field
        // Note, the ...rest is important because it allows you to pass any
        // additional fields to the internal <input>.
        const { onChange, onBlur, field, ...rest } = props

        const { value, error, warning, success, setValue, setTouched } = fieldApi

        return (
          <div>
            <input
              {...rest}
              value={value || ''}
              onChange={e => {
                setValue(e.target.value)
                if (onChange) {
                  onChange(e.target.value, e)
                }
              }}
              onBlur={e => {
                setTouched()
                if (onBlur) {
                  onBlur(e)
                }
              }}
            />
            {error ? <Message color="red" message={error} /> : null}
            {!error && warning ? <Message color="orange" message={warning} /> : null}
            {!error && !warning && success ? <Message color="green" message={success} /> : null}
          </div>
        )
      }}
    </Field>
  )

  FormWithCustomInput = () => (
    <Form >
      { formApi => (
        <form onSubmit={formApi.submitForm} id="form5">
          <label htmlFor="firstName4">First name</label>
          <Text field="firstName" id="firstName4" />
          <label htmlFor="hello2">Custom hello world</label>
          <CustomText field="hello" id="hello2" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
  )
`

  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="html">{code}</Code>
    </div>
  )
}

const FieldApiMethods = () => (
  <div>
    <table className="table" style={{ tableLayout: 'fixed' }}>
      <thead className="thead-inverse">
        <tr>
          <th style={{ width: '150px' }}>Attribute</th>
          <th>Example</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">value</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">"hello"</PrismCode>
              </pre>
            </pre>
          </td>
          <td>The value of the field.</td>
        </tr>
        <tr>
          <th scope="row">error</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">"This is a required field"</PrismCode>
              </pre>
            </pre>
          </td>
          <td>The fields error.</td>
        </tr>
        <tr>
          <th scope="row">warning</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">"The password should be longer"</PrismCode>
              </pre>
            </pre>
          </td>
          <td>The fields warning.</td>
        </tr>
        <tr>
          <th scope="row">success</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">"Your field looks good!"</PrismCode>
              </pre>
            </pre>
          </td>
          <td>The fields success.</td>
        </tr>
        <tr>
          <th scope="row">touched</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">true</PrismCode>
              </pre>
            </pre>
          </td>
          <td>The fields touched.</td>
        </tr>
        <tr>
          <th scope="row">fieldName</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">"firstName"</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            The fields name ( when you passed in field="yourFieldName" ).
          </td>
        </tr>
        <tr>
          <th scope="row">setValue</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setValue( 'HelloWorld!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that takes the value you want to set the field to.</td>
        </tr>
        <tr>
          <th scope="row">setError</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setError( 'Error message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that takes the value you want to set the fields error to.</td>
        </tr>
        <tr>
          <th scope="row">setWarning</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setWarning( 'Warning message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that takes the value you want to set the fields warning to.</td>
        </tr>
        <tr>
          <th scope="row">setSuccess</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setSuccess( 'Success message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that takes the value you want to set the fields success to.</td>
        </tr>
        <tr>
          <th scope="row">setTouched</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setTouched( true )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that sets the fields touched to true or false.</td>
        </tr>
      </tbody>
    </table>
  </div>
)

class CustomInput extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4" id="custom-inputs">
          Custom Input
        </h2>
        <p>
          If the out of the box inputs are not enough for you. You can simply customize them, by
          creating your very own input elements. This is done by leverageing the `Field` component that is
          availible in react-form. Below is an example of a form that uses a custom input. Our
          custom input has internal error, success, and warning messages that know when to get
          shown. See docs at bottom of this page.
        </p>
        <p>Play around with the Hello World field and see how the custom text input reacts.</p>
        <p>
          <strong> Hint: </strong> try typing {'"Foo", "Hello World", and "Hello World!!!"'}
        </p>
        <FormContent />
        <br />
        <CustomFormCode />
        <br />
        <hr />
        <h3 className="mb-4">Docs</h3>
        <p>
          <code>Field</code> gives you access to the <code>fieldApi</code>. This is very similar to
          how a <code>Form</code> gives you the <code>formApi</code>. The difference is that{' '}
          <code>fieldApi</code>s functions are scoped to the field, and it only has a subset of the
          formApis functions.
        </p>
        <FieldApiMethods />
      </div>
    )
  }
}

export default CustomInput
