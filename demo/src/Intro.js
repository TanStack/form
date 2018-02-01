/* ------------- Imports -------------- */
import React, { Component } from 'react'
import { PrismCode } from 'react-prism'

// TODO Break this file apart... its way to big :)

/* ------------- Form  Library Imports -------------- */
import { Form, Text } from '../../src/'

const rawStyles = `
input {
  margin-bottom: 1rem;
  display: block;
}

textarea {
  margin-bottom: 1rem;
  display: block;
}

select {
  margin-bottom: 1rem;
  display: block;
}
`

const childRender = ` <Form>
    { formApi => (
      <form onSubmit={formApi.submitForm}>
        <Text field="hello" id="hello" />
        <button type="submit">Submit</button>
      </form>
    )}
  </Form>
`

const renderRender = ` <Form render={ formApi => (
      <form onSubmit={formApi.submitForm}>
        <Text field="hello" id="hello" />
        <button type="submit">Submit</button>
      </form>
    )}>
  </Form>
`

const componentProp = ` const FormContent = props => (
    <form onSubmit={props.formApi.submitForm}>
      <Text field="hello" id="hello" />
      <button type="submit">Submit</button>
    </form>
  );

  <Form component={FormContent} />
`

const formApiCodeExample = `
import { Form, Text } from '../../src';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="form1" className="mb-4">
      <label htmlFor="hello">Hello World</label>
      <Text field="hello" id="hello" validate={validate} />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
}
`

const formApiCodeExampleWithValidation = `
import { Form, Text } from '../../src';

const validate = value => ({
  error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
  warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
  success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
})

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="form1" className="mb-4">
      <label htmlFor="hello">Hello World</label>
      <Text field="hello" id="hello" validate={validate} />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`

const validate = value => ({
  error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
  warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
  success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
})

const ExampleForm = () => (
  <Form>
    {formApi => (
      <div className="mb-4">
        <form onSubmit={formApi.submitForm} id="form1" className="mb-4">
          <label htmlFor="hello">Hello World</label>
          <Text field="hello" id="hello" validate={validate} />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <h5 className="mb-4">
          The <code>formApi</code> attributes ( <code>formState</code> ):
        </h5>
        <FieldApi formApi={formApi} />
        <h5 className="mb-4">
          The <code>formApi</code> methods:
        </h5>
        <FieldApiMethods formApi={formApi} />
      </div>
    )}
  </Form>
)

const FieldApi = ({ formApi }) => (
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
          <th scope="row">values</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.values)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is the value entered
            or selected. Object is empty by default.
          </td>
        </tr>
        <tr>
          <th scope="row">touched</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.touched)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is true or undefined (
            touched or untouched ) Object is empty by default. Submitting form will cause all fields
            to be touched.
          </td>
        </tr>
        <tr>
          <th scope="row">errors</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.errors)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is the error
            associated with that field. Object is empty by default. If a <code>validateError</code>{' '}
            function is provided, then it will get called when the form mounts.
          </td>
        </tr>
        <tr>
          <th scope="row">warnings</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.warnings)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is the warning
            associated with that field. Object is empty by default. If a{' '}
            <code>validateWarning</code> function is provided, then it will get called when the form
            mounts.
          </td>
        </tr>
        <tr>
          <th scope="row">successes</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.successes)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is the success
            associated with that field. Object is empty by default. If a{' '}
            <code>validateSuccess</code> function is provided, then it will get called when the form
            mounts.
          </td>
        </tr>
        <tr>
          <th scope="row">submits</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.submits)}</PrismCode>
            </pre>
          </td>
          <td>Submission attempts. ( the number of times the submit button was clicked )</td>
        </tr>
        <tr>
          <th scope="row">submitted</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.submitted)}</PrismCode>
            </pre>
          </td>
          <td>
            If form was successfully submitted. ( only gets set once and only if form is NOT in
            error state )
          </td>
        </tr>
        <tr>
          <th scope="row">submitting</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.submitting)}</PrismCode>
            </pre>
          </td>
          <td>True while the form is in the process of submitting. False when its not.</td>
        </tr>
        <tr>
          <th scope="row">asyncValidations</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.asyncValidations)}</PrismCode>
            </pre>
          </td>
          <td>
            The number of asynchronous validations currently occuring. See the{' '}
            <a href="#async-validation">asynchronous validation section</a> of these docs for
            additional details.
          </td>
        </tr>
        <tr>
          <th scope="row">validating</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.validating)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code>, and value is a bool. Value is
            true when that field is activley validating, and falsey otherwise. See the{' '}
            <a href="#async-validation">asynchronous validation section</a> of these docs for
            additional details.
          </td>
        </tr>
        <tr>
          <th scope="row">validationFailures</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.validationFailures)}</PrismCode>
            </pre>
          </td>
          <td>
            The number of asynchronous validation failures that have occured. This value will get
            incimented each time an asynchronous validation fails, and decrimented if it succeeds.
            Note, it will NOT get incrimented twice for the same field. See the{' '}
            <a href="#async-validation">asynchronous validation section</a> of these docs for
            additional details.
          </td>
        </tr>
        <tr>
          <th scope="row">validationFailed</th>
          <td>
            <pre>
              <PrismCode className="language-json">{JSON.stringify(formApi.validationFailed)}</PrismCode>
            </pre>
          </td>
          <td>
            Key value pair where key is the form <code>field</code> and value is a bool. Value is
            true when that fields most recent async validation had a failure, and falsey otherwise.
            See the <a href="#async-validation">asynchronous validation section</a> of these docs
            for additional details.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

const FieldApiMethods = ({ formApi }) => (
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
          <th scope="row">submitForm</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">submitForm( event )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            This function will submit the form and tirgger all lifecycle events:
            <ul>
              <li>validateError</li>
              <li>validateWarning</li>
              <li>validateSuccess</li>
              <li>preValidate</li>
              <li>allAsyncValidators</li>
              <li>onSubmit ( if form is valid )</li>
            </ul>
            Tie the native html <code>forms</code> <code>onSubmit</code> function to this function,
            and clicking the submit button will trigger the form submission.
          </td>
        </tr>
        <tr>
          <th scope="row">setValue</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setValue( 'hello', 'HelloWorld!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code> name, and the
            second is the value you want to set it to.
          </td>
        </tr>
        <tr>
          <th scope="row">setAllValues</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setAllValues( {"{ hello: 'HelloWorld!' }"} )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes an object where the field is the <code>field</code> name, and the
            value is the value you want to set it to. Note, dont try to set nested forms values. If
            you want to do this, call the nested forms <code>setAllValues</code>.
          </td>
        </tr>
        <tr>
          <th scope="row">setError</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setError( 'hello', 'Error message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code> name, and the
            second is an error message.
          </td>
        </tr>
        <tr>
          <th scope="row">setWarning</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setWarning( 'hello', 'Warning message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code> name, and the
            second is a warning message.
          </td>
        </tr>
        <tr>
          <th scope="row">setSuccess</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setSuccess( 'hello', 'Success message!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code> name, and the
            second is a success message.
          </td>
        </tr>
        <tr>
          <th scope="row">setTouched</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setTouched( 'hello', true )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code> name, and the
            second is true or false.
          </td>
        </tr>
        <tr>
          <th scope="row">setAllTouched</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setAllTouched( {'{ hello: true }'} )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes an object where the field is the <code>field</code> name, and the
            value is true or false. Note, dont try to set nested forms touched. If you want to do
            this, call the nested forms <code>setAllTouched</code>.
          </td>
        </tr>
        <tr>
          <th scope="row">addValue</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">addValue( 'hello', 'value!' )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code>
            name of an array field, and the second is the value you would like to add. Go look at
            the dynamic forms section to get a better understanding.
          </td>
        </tr>
        <tr>
          <th scope="row">removeValue</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">removeValue( 'hello', 3 )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes two parameters, the first is the <code>field</code>
            name of an array field, and the second is the index in that array that you would like to
            remove. Go look at the dynamic forms section to get a better understanding.
          </td>
        </tr>
        <tr>
          <th scope="row">swapValues</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">swapValues( 'friends', 0, 2 )</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that takes three parameters, the first is the <code>field</code>
            name of an array field, the next two are the indexes you want to switch.
          </td>
        </tr>
        <tr>
          <th scope="row">resetAll</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">resetAll()</PrismCode>
              </pre>
            </pre>
          </td>
          <td>Function that resets the entire form to its initial state.</td>
        </tr>
        <tr>
          <th scope="row">getFormState</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">getFormState()</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that returns the <code>formState</code>. Use this if you need to save the
            current state of the form.
          </td>
        </tr>
        <tr>
          <th scope="row">setFormState</th>
          <td>
            <pre>
              <pre>
                <PrismCode className="language-jsx">setFormState()</PrismCode>
              </pre>
            </pre>
          </td>
          <td>
            Function that accepts a <code>formState</code>. Use this if you want to load a saved
            form state. <strong>Warning:</strong> this will override the whole form state.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

const FormProps = () => (
  <div>
    <h3 className="mb-4">Form Props</h3>
    <table className="table" style={{ tableLayout: 'fixed' }}>
      <thead className="thead-inverse">
        <tr>
          <th style={{ width: '180px' }}>Name</th>
          <th style={{ width: '100px' }}>Type</th>
          <th style={{ width: '100px' }}>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <code>children</code>
          </th>
          <td>
            <pre>node</pre>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>A function that is given the form api as a parameter. FAAC ( Function As A Child )</td>
        </tr>
        <tr>
          <th scope="row">
            <code>component</code>
          </th>
          <td>
            <pre>node</pre>
          </td>
          <td>no</td>
          <td>A React component that is given the form api as a prop.</td>
        </tr>
        <tr>
          <th scope="row">
            <code>render</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>A render function that is given the form api as a parameter.</td>
        </tr>
        <tr>
          <th scope="row">
            <code>validateOnMount</code>
          </th>
          <td>
            <pre>bool</pre>
          </td>
          <td>no</td>
          <td>Use this if you want the form to validate when it gets mounted. This will
          call asyncValidation, syncValidation, and preValidate when the form mounts</td>
        </tr>
        <tr>
          <th scope="row">
            <code>validateOnSubmit</code>
          </th>
          <td>
            <pre>bool</pre>
          </td>
          <td>no</td>
          <td>
            Use this if you dont want the form to validate until it gets submitted. This will
            prevent asyncValidation, syncValidation, and preValidate from getting called until
            submit.
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>defaultValues</code>
          </th>
          <td>
            <pre>obj</pre>
          </td>
          <td>no</td>
          <td>
            Use this if you want to populate the form with initial values.
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>onSubmit</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form is submitted successfully. This function will pass
            two parameters: the form values, and the submission event<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">onSubmit( values, e )</PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>preSubmit</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that is a value filter that happens after validation, and before a successful
            submission. Use it to scrub and/or clean your values before they are submitted. Whatever
            you return will NOT replace all of the values in that form's state, but will be passed
            to the onSubmit method. <strong>Warning:</strong> We pass <code>formApi</code>
            to this function because some use cases warrent needing the Api, however, I would try to
            avoid making modifications to the form state here because it may allow you to submit an
            invalid form!<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  preSubmit( values, formApi ) =>{' '}
                  {'({ firstName: values.firstName + "!", lastName: values.lastName})'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>onSubmitFailure</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when submission fails due to errors, or when
            <code>onSubmit</code> threw an error. This function will pass two parameters: the form
            validation errors, the formApi, and an error thrown during the call to{' '}
            <code>onSubmit</code>. <br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  onSubmitFailure( errors, formApi, onSubmitError )
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>formDidUpdate</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form updates. Function recieves the{' '}
            <code>formState</code> as a parameter. <br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">formDidUpdate( formState )</PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>preValidate</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called before the form performs validation. Function accepts the
            values as a parameter, and must return a new values object, where the key is the field
            name, and the value is the value<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  preValidate( values ) =>{' '}
                  {'({ firstName: values.firstName + "!", lastName: values.lastName})'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>validateError</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form performs validation. Function accepts the values as
            a parameter and must return errors object where the key is the field name, and the value
            is an error message or null<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  validateError( values ) =>{' '}
                  {'({ firstName: null, lastName: "Last name is required"})'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>validateWarning</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form performs validation. Function accepts the values as
            a parameter and must return warnings object where the key is the field name, and the
            value is an warning message or null<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  validateWarning( values ) => {'({ firstName: null, lastName: "To short"})'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>validateSuccess</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form performs validation. Function accepts the values and
            current errors as a parameters, and must return successes object where the key is the
            field name, and the value is an success message or null<br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  validateSuccess( values, errors ) =>{' '}
                  {'({ firstName: null, lastName: "Nice name!"})'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>asyncValidators</code>
          </th>
          <td>
            <pre>obj</pre>
          </td>
          <td>no</td>
          <td>
            An object where the key is the field name, and the value is an asynchronous function.
            Each function accepts the value as a parameter, and must return a validation object,
            where the keys are one of ['error', 'warning', 'success'], and the value is a message or
            null. The function will get called when you tab out of the field for the associated
            function. If you do not want to overwrite the error, warning, or success values that
            were set by your syncronous validators, simply dont pass that parameter in the object
            you return.
            <br />
            <pre>
              <pre>
                <PrismCode className="language-jsx">
                  {'{ username: async () => ({ error: "Username already taken :(" }) }'}
                </PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>dontPreventDefault</code>
          </th>
          <td>
            <pre>bool</pre>
          </td>
          <td>no</td>
          <td>
            Pass this in if you want to prevent the form submission from "preventingDefault". You
            would, for example, use this when you want to use a good old form submission using
            action="/foo.php" on your form. Note: if you are using form validators and the form has
            errors, i.e is in error state, then it will still prevent default, regardless of this
            prop.
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>getApi</code>
          </th>
          <td>
            <pre>function</pre>
          </td>
          <td>no</td>
          <td>
            To retrieve the form api as a callback, you can pass a function to the `getApi` prop.
            Your function will be called with the formApi as the only parameter. You can save this
            as a reference to easily manipulate your form from outside of the form scope.{' '}
            <strong>Warning:</strong>
            this will give you the formApi when the component mounts. Dont try and use anything from
            the <code>formState</code>, as it will be out of date. In other words, only call formApi
            methods such as <code>formApi.setValue( {"{ foo: 'bar' }"} )</code>
            <pre>
              <pre>
                <PrismCode className="language-jsx">{'getApi( formApi )'}</PrismCode>
              </pre>
            </pre>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

class Intro extends Component {
  render () {
    return (
      <div className="mb-4">
        <h3>Intro</h3>
        <p className="mb-4">
          Say hello to the best react form library you have ever used!
          <code>react-form</code> is an extensive, simple, and efficient solution for creating basic
          to complex forms in react. Out of the box you get the ability to grab and manipulate
          values; set errors, warnings, and successes; customize your inputs, perform asynchronous
          validation, and much more!
        </p>
        <h3>Motivation</h3>
        <p className="mb-4">
          Simplicity and efficiency. This form works in IE! and its fast! There are many other
          libraries that exist, but they dont function in IE and, can get pretty complex. You can
          create very complex forms quickly with only a few lines of code.
        </p>
        <h3>Notes</h3>
        <p className="mb-4">
          Just wanted to point out that this webpage is styled with Bootstrap4, and the stylesheet
          you see below. The reason to point this out is that, by default, your inputs will not look
          the way mine do! Under the hood the default components are just inputs, selects,
          textareas, etc. I just added some simple styles to make them look good for presentation.
          So if you see classes in the example code like
          <code>"mb-4"</code>, or if you are quick to point out that inputs are not block elements
          by default dont freak out! Focus on the core structure of the forms.
        </p>
        <pre className="mb-4">
          <pre><PrismCode className="language-css">{rawStyles}</PrismCode></pre>
        </pre>
        <hr />
        <br />
        <FormProps />
        <hr />
        <br />
        <h3>Form Api</h3>
        <p className="mb-4">
          React Form gives you access to the <code>formApi</code> in three different ways. You as the
          developer can use whichever method you want.
        </p>
        <ol>
          <li>
            By passing the <code>formApi</code> as a parameter to a child render function.
          </li>
          <pre>
            <pre>
              <PrismCode className="language-jsx">{childRender}</PrismCode>
            </pre>
          </pre>
          <li>
            By passing the <code>formApi</code> as a parameter to a render prop.
          </li>
          <pre>
            <pre>
              <PrismCode className="language-jsx">{renderRender}</PrismCode>
            </pre>
          </pre>
          <li>
            By passing the <code>formApi</code> as a prop to a component prop.
          </li>
          <pre>
            <pre>
              <PrismCode className="language-jsx">{componentProp}</PrismCode>
            </pre>
          </pre>
        </ol>
        <p className="mb-4">
          Below is an example of a react form that uses the first method. Note how we the
          <code>formApis.submitForm</code> to the native <code>&lt;form&gt;</code> onSubmit.
        </p>
        <h5>Source Code:</h5>
        <pre className="mb-4">
          <pre>
            <PrismCode className="language-jsx">{formApiCodeExample}</PrismCode>
          </pre>
        </pre>
        <h5>Rendered example:</h5>
        <p>
          Play around with the Hello World field and see how the <code>formState</code> updates in
          the table! <strong>Hint:</strong> try typing{' '}
          {'"Foo", "Hello World", and "Hello World!!!"'}
        </p>
        <ExampleForm />
        <h5>Source code with validation:</h5>
        <p>
          The validation occured in the Hello World example above because of the validators that
          were passed in, see code below.
        </p>
        <pre className="mb-4">
          <pre>
            <PrismCode className="language-jsx">{formApiCodeExampleWithValidation}</PrismCode>
          </pre>
        </pre>
      </div>
    )
  }
}

export default Intro
