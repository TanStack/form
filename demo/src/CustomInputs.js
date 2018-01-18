/* ------------- Imports -------------- */
import React, { Component } from 'react'
// import { PrismCode } from 'react-prism';

/* ------------- Form  Library Imports -------------- */
import { Form, Text, withFormField } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const Message = ({ color, message }) => (
  <div className="mb-4" style={{ color }}>
    <small>{message}</small>
  </div>
)

class CustomTextWrapper extends Component {
  render () {
    const { fieldApi, onInput, ...rest } = this.props

    const { value, error, warning, success, setValue, setTouched } = fieldApi

    return (
      <div>
        <input
          value={value || ''}
          onInput={e => {
            setValue(e.target.value)
            if (onInput) {
              onInput(e)
            }
          }}
          onBlur={() => {
            setTouched()
          }}
          {...rest}
        />
        {error ? <Message color="red" message={error} /> : null}
        {!error && warning ? <Message color="orange" message={warning} /> : null}
        {!error && !warning && success ? <Message color="green" message={success} /> : null}
      </div>
    )
  }
}

const CustomText = withFormField(CustomTextWrapper)

const FormContent = ({ formApi }) => (
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
  </div>
)

const CustomFormCode = () => {
  const code = `
  import { Form, Text, FormField } from '../../src';

  // Define a custom message component
  const Message = ({ color, message }) => {
    return (
      <div className="mb-4" style={{ color }}>
        <small>{message}</small>
      </div>
    );
  }

  // Define your custom input
  // Note, the ...rest is important because it allows you to pass any
  // additional fields to the internal <input>.
  class CustomTextWrapper extends Component {

    render() {

      const {
        fieldApi,
        onInput,
        ...rest
      } = this.props;

      const {
        getValue,
        getError,
        getWarning,
        getSuccess,
        setValue,
        setTouched,
      } = fieldApi;

      const error = getError();
      const warning = getWarning();
      const success = getSuccess();

      return (
        <div>
          <input
            value={value}
            onInput={( e ) => {
              setValue(e.target.value);
              if ( onInput ) {
                onInput( e );
              }
            }}
            onBlur={() => {
              setTouched();
            }}
            {...rest} />
          { error ? <Message color="red" message={error} /> : null }
          { !error && warning ? <Message color="orange" message={warning} /> : null }
          { !error && !warning && success ? <Message color="green" message={success} /> : null }
        </div>
      );
    }
  }

  // Use the form field and your custom input together to create your very own input!
  const CustomText = withFormFieldCustomTextWrapper);

  const errorValidator = (values) => {
    return {
      hello: !values.hello || !values.hello.match( /Hello World/ ) ? "Input must contain 'Hello World'" : null
    };
  };

  const warningValidator = (values) => {
    return {
      hello: !values.hello ||
             !values.hello.match( /^Hello World$/ ) ? "Input should equal 'Hello World'" : null
    };
  };

  const successValidator = (values) => {
    return {
      hello: values.hello && values.hello.match( /Hello World/ ) ? "Thanks for entering 'Hello World'!" : null
    };
  };

  class FormWithCustomInput extends Component {
    render() {
      return (
        <div>
          <Form
            validateWarning={warningValidator}
            validateSuccess={successValidator}
            validateError={errorValidator}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form5">
                <label htmlFor="firstName4">First name</label>
                <Text field="firstName" id="firstName4" />
                <label htmlFor="hello2">Custom hello world</label>
                <CustomText field="hello" id="hello2" />
                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
              </form>
            )}
          </Form>
        </div>
      );
    }
  }
`

  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="html">{code}</Code>
    </div>
  )
}

const errorValidator = values => ({
  hello:
    !values.hello || !values.hello.match(/Hello World/) ? "Input must contain 'Hello World'" : null,
})

const warningValidator = values => ({
  hello:
    !values.hello || !values.hello.match(/^Hello World$/)
      ? "Input should equal 'Hello World'"
      : null,
})

const successValidator = values => ({
  hello:
    values.hello && values.hello.match(/Hello World/) ? "Thanks for entering 'Hello World'!" : null,
})

const FieldApiMethods = ({ fieldApi }) => (
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
          <th scope="row">getValue</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">value</code>
              </pre>
            </pre>
          </td>
          <td>Function that returns the value of the field.</td>
        </tr>
        <tr>
          <th scope="row">getError</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">getError()</code>
              </pre>
            </pre>
          </td>
          <td>Function that returns the fields error.</td>
        </tr>
        <tr>
          <th scope="row">getWarning</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">getWarning()</code>
              </pre>
            </pre>
          </td>
          <td>Function that returns the fields warning.</td>
        </tr>
        <tr>
          <th scope="row">getSuccess</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">getSuccess()</code>
              </pre>
            </pre>
          </td>
          <td>Function that returns the fields success.</td>
        </tr>
        <tr>
          <th scope="row">getTouched</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">getTouched()</code>
              </pre>
            </pre>
          </td>
          <td>Function that returns the fields touched.</td>
        </tr>
        <tr>
          <th scope="row">getFieldName</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">getFieldName()</code>
              </pre>
            </pre>
          </td>
          <td>
            Function that returns the fields name ( when you passed in field="yourFieldName" ).
          </td>
        </tr>
        <tr>
          <th scope="row">setValue</th>
          <td>
            <pre>
              <pre>
                <code className="language-jsx">setValue( 'HelloWorld!' )</code>
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
                <code className="language-jsx">setError( 'Error message!' )</code>
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
                <code className="language-jsx">setWarning( 'Warning message!' )</code>
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
                <code className="language-jsx">setSuccess( 'Success message!' )</code>
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
                <code className="language-jsx">setTouched( true )</code>
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
          creating your very own input elements. This is done by leverageing the FormField HOC that
          is availible in react-form. Below is an example of a form that uses a custom input. Our
          custom input has internal error, success, and warning messages that know when to get
          shown. See docs at bottom of this page.
        </p>
        <p>Play around with the Hello World field and see how the custom text input reacts.</p>
        <p>
          <strong> Hint: </strong> try typing {'"Foo", "Hello World", and "Hello World!!!"'}
        </p>
        <Form
          validateWarning={warningValidator}
          validateSuccess={successValidator}
          validateError={errorValidator}
        >
          <FormContent />
        </Form>
        <br />
        <CustomFormCode />
        <br />
        <hr />
        <h3 className="mb-4">Docs</h3>
        <p>
          <code>FormField</code> gives you access to the <code>fieldApi</code>. This is very similar
          to how a <code>Form</code> gives you the <code>formApi</code>. The difference is that{' '}
          <code>fieldApi</code>s functions are scoped to the field, and it only has a subset of the
          formApis functions.
        </p>
        <FieldApiMethods />
      </div>
    )
  }
}

export default CustomInput
