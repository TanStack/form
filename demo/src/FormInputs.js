/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, Radio, TextArea, Select, Checkbox } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const InputCode = ({ code }) => (
  <div>
    <h5>Source Code:</h5>
    <Code type="html">{code}</Code>
  </div>
)


const statusOptions = [
  {
    label: 'Single',
    value: 'single',
  },
  {
    label: 'In a Relationship',
    value: 'relationship',
  },
  {
    label: "It's Complicated",
    value: 'complicated',
  },
]

/* -------------------------------- Text Input ----------------------------- */

const textInputCode = `
import { Form, Text } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="text-input-form">
      <label htmlFor="text-input-firstName">First name</label>
      <Text field="firstName" id="text-input-firstName" />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`

const TextInput = () => (
  <div>
    <h4>Text Input</h4>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="text-input-form">
          <label htmlFor="text-input-firstName">First name</label>
          <Text field="firstName" id="text-input-firstName" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={textInputCode} />
  </div>
)

/* -------------------------------- Disabled Text Input ----------------------------- */

const disabledTextInputCode = `
import { Form, Text } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="text-input-disabled-form">
      <label htmlFor="text-input-disabled-firstName">First name</label>
      <Text field="firstName" id="text-input-disabled-firstName" disabled />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`

const DisabledTextInput = () => (
  <div>
    <h4>Disabled Text Input</h4>
    <p>Below is an example of passing in a native html prop to a text input.</p>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="text-input-disabled-form">
          <label htmlFor="text-input-disabled-firstName">First name</label>
          <Text field="firstName" id="text-input-disabled-firstName" disabled />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={disabledTextInputCode} />
  </div>
)


/* ----------------------------- Text Area Input --------------------------- */

const textAreaInputCode = `
import { Form, TextArea } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="text-area-input-form">
      <label htmlFor="text-area-input-bio">Bio</label>
      <TextArea field="bio" id="text-area-input-bio" />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`

const TextAreaInput = () => (
  <div>
    <h4>TextArea Input</h4>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="text-area-input-form">
          <label htmlFor="text-area-input-bio">Bio</label>
          <TextArea field="bio" id="text-area-input-bio" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={textAreaInputCode} />
  </div>
)

/* ------------------------------- Radio Input ----------------------------- */

const radioInputCode = `
import { Form, Radio } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="radio-input-form">
      <label htmlFor="radio-input-male" className="mr-2">Male</label>
      <Radio field="gender" value="male" id="radio-input-male" />
      <label htmlFor="radio-input-female" className="mr-2">Female</label>
      <Radio field="gender" value="female" id="radio-input-female" />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`
const RadioInput = () => (
  <div>
    <h4>Radio Input</h4>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="radio-input-form">
          <label htmlFor="radio-input-male" className="mr-2">Male</label>
          <Radio field="gender" value="male" id="radio-input-male" />
          <label htmlFor="radio-input-female" className="mr-2">Female</label>
          <Radio field="gender" value="female" id="radio-input-female" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={radioInputCode} />
  </div>
)


/* ------------------------------- Checkbox Input ----------------------------- */

const checkboxInputCode = `
import { Form, Checkbox } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="checkbox-input-form">
      <label htmlFor="checkbox-input-authorize" className="mr-2">Authorize</label>
      <Checkbox field="authorize" id="checkbox-input-authorize" />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`
const CheckboxInput = () => (
  <div>
    <h4>Checkbox Input</h4>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="checkbox-input-form">
          <label htmlFor="checkbox-input-authorize" className="mr-2">Authorize</label>
          <Checkbox field="authorize" id="checkbox-input-authorize" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={checkboxInputCode} />
  </div>
)


/* ------------------------------- Select Input ----------------------------- */

const selectInputCode = `
import { Form, Select } from 'react-form';

<Form>
  {formApi => (
    <form onSubmit={formApi.submitForm} id="select-input-form">
      <label htmlFor="select-input-status">Relationship status</label>
      <Select field="status" id="select-input-status" options={statusOptions} className="mb-4" />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
  )}
</Form>
`
const SelectInput = () => (
  <div>
    <h4>Select Input</h4>
    <Form>
      {formApi => (
        <form onSubmit={formApi.submitForm} id="select-input-form">
          <label htmlFor="select-input-status">Relationship status</label>
          <Select field="status" id="select-input-status" options={statusOptions} className="mb-4" />
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </Form>
    <br />
    <InputCode code={selectInputCode} />
  </div>
)

/* ------------------------------- Input Props ----------------------------- */

const InputProps = () => (
  <div>
    <h3 className="mb-4">Input Props</h3>
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
            <code>field</code>
          </th>
          <td>
            <pre>string</pre>
            <pre>array</pre>
          </td>
          <td>yes!</td>
          <td>
            Every input must have a field. This is how the form manages
            the state of this input. See the field syntax section for additional
            details on this prop.
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
            value as a parameter, and must return a value.
            <pre>
              <pre>
                <Code className="language-jsx">
                  ( value ) => value + '!'
                </Code>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>validate</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            Function that gets called when form performs validation. Function accepts the value as
            a parameter and must return either a validation object,
            where the keys are one of ['error', 'warning', 'success'], and the value is a message or
            null, OR if you only care about errors you can simple return an error!
            <pre>
              <pre>
                <Code className="language-jsx">
  {`value => "username is required field"\n`}
OR{'\n'}
{`value => ({
  error: "username is required field",
  warning: "make sure your username is correct!",
}) }`}
                </Code>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>asyncValidate</code>
          </th>
          <td>
            <pre>func</pre>
          </td>
          <td>no</td>
          <td>
            An asynchronous function that accepts the value as a parameter,
            and must return either a validation object,
            where the keys are one of ['error', 'warning', 'success'], and the value is a message or
            null, OR if you only care about errors you can simple return an error!.
            The function will get called when you tab out of the field for the associated
            function.
            <br />
            <pre>
              <pre>
                <Code className="language-jsx">
                  {'async (value) => ({ error: "Username already taken :(" }) }'}
                </Code>
              </pre>
            </pre>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <code>{'<input> props'}</code>
          </th>
          <td>
            <pre>html-5</pre>
          </td>
          <td>no</td>
          <td>
            All inputs can accept any props that a native html input, select, textarea, etc.
            can accept. For example, if you want to disable a text input, you would
            simply pass <code>disabled</code>.
            <br />
            <pre>
              <pre>
                <Code className="language-jsx">
                  {'<Text disabled/>'}
                </Code>
              </pre>
            </pre>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)


/* ------------------------------- Form Inputs ----------------------------- */

class FormInputs extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4">Form Inputs</h2>
        <p>
          ReactForm comes with some basic default inputs. All inputs are built
          utalizing the <code>{'<Field />'}</code> and therefore have access to
          all the properties of the <code>{'<Field />'}</code>. This design allows
          you to define your very own Input types if the defaults dont suite your needs!
          For additional information on custom Inputs, see the{' '}
          <a href="#custom-input">custom input section</a>.
          If you are just getting started, or dont care to create your own custom inputs,
          simply take a look at the following props and examples.
        </p>
        <hr/>
        <InputProps />
        <hr/>
        <TextInput />
        <hr/>
        <TextAreaInput />
        <hr />
        <RadioInput />
        <hr />
        <CheckboxInput />
        <hr />
        <SelectInput />
        <hr />
        <DisabledTextInput />
      </div>
    );
  }
}

export default FormInputs;
