/* ------------- Imports -------------- */
import React, { Component } from 'react'
import { PrismCode } from 'react-prism'

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text,
  RadioGroup,
  Radio,
  withFormApi,
  withFieldApi,
  withRadioGroup,
} from '../../src/'

/* ---------------- Other Imports ------------------ */

import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const HOCCode = () => {
  const code = `
  import {
    Form,
    Text,
    RadioGroup,
    Radio,
    withFormApi,
    withFieldApi,
    withRadioGroup
  } from 'react-form';

  const SomeComponent = stuff => (
    <pre>
      <PrismCode className="language-json">
        {JSON.stringify(stuff, null, 2)}
      </PrismCode>
    </pre>
  )

  const ComponentWithFormApi = withFormApi(SomeComponent)
  const ComponentWithFirstNameField = withFieldApi('firstName')(SomeComponent)
  const ComponentWithGenderField = withFieldApi('gender')(SomeComponent)
  const ComponentWithRadioGroup = withRadioGroup(SomeComponent)

  <Form>
    {formApi => (
      <div>
        <form onSubmit={formApi.submitForm} id="hoc-form">
          <label htmlFor="firstName">First name</label>
          <Text field="firstName" id="hoc-firstName" />
          <RadioGroup field="gender">
            <label htmlFor="male" className="mr-2">Male</label>
            <Radio value="male" id="male" className="mr-3 d-inline-block" />
            <label htmlFor="female" className="mr-2">Female</label>
            <Radio value="female" id="female" className="d-inline-block" />
            <h5>Component with radioGroup</h5>
            <ComponentWithRadioGroup />
          </RadioGroup>
          <button type="submit" className="mb-4 btn btn-primary">
            Submit
          </button>
        </form>
        <h5>Component with formApi</h5>
        <ComponentWithFormApi />
        <h5>Component with fieldApi for firstname</h5>
        <ComponentWithFirstNameField />
        <h5>Component with fieldApi for gender</h5>
        <ComponentWithGenderField />
      </div>
    )}
  </Form>

  `
  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="jsx">{code}</Code>
    </div>
  )
}

const SomeComponent = stuff => (
  <pre>
    <PrismCode className="language-json">
      {JSON.stringify(stuff, null, 2)}
    </PrismCode>
  </pre>
)

const ComponentWithFormApi = withFormApi(SomeComponent)
const ComponentWithFirstNameField = withFieldApi('firstName')(SomeComponent)
const ComponentWithGenderField = withFieldApi('gender')(SomeComponent)
const ComponentWithRadioGroup = withRadioGroup(SomeComponent)

class HOCForm extends Component {
  render () {
    return (
      <div>
        <h2 className="mb-4">Higher-Order Components</h2>
        <p>
          React form also exposes higher order components that allow you to
          gain access to the <code>formApi</code>, <code>fieldApi</code>,
          and <code>radioGroup</code>. This is super powerfull! and allows
          you to gain access to <code>ReactForms</code> data wherever you want!!!
        </p>
        <br />
        <Form>
          {formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="hoc-form">
                <label htmlFor="firstName">First name</label>
                <Text field="firstName" id="hoc-firstName" />
                <RadioGroup field="gender">
                  <label htmlFor="male" className="mr-2">Male</label>
                  <Radio value="male" id="male" className="mr-3 d-inline-block" />
                  <label htmlFor="female" className="mr-2">Female</label>
                  <Radio value="female" id="female" className="d-inline-block" />
                  <h5>Component with radioGroup</h5>
                  <ComponentWithRadioGroup />
                </RadioGroup>
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
              </form>
              <h5>Component with formApi</h5>
              <ComponentWithFormApi />
              <h5>Component with fieldApi for firstname</h5>
              <ComponentWithFirstNameField />
              <h5>Component with fieldApi for gender</h5>
              <ComponentWithGenderField />
            </div>
          )}
        </Form>
        <HOCCode />
      </div>
    )
  }
}

export default HOCForm
