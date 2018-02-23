/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, NestedField } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const NestedFieldArrayCode = () => {
  const code = `
  import { Form, Text, NestedField } from 'react-form';

  const Friend = () => (
    <div>
      <h2>Friend</h2>
      <label>
        First name <Text field="firstName" />
      </label>
      <label>
        Last name <Text field="lastName" />
      </label>
    </div>
  )

  class FormWithArrayOfNestedForms extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    render() {
      return (
        <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
          {formApi => (
            <form onSubmit={formApi.submitForm} id="form3">
              <NestedField field={['friends', 0]} component={Friend} />
              <NestedField field={['friends', 1]} component={Friend} />
              <NestedField field={['friends', 2]} component={Friend} />
              <button type="submit" className="mb-4 btn btn-primary">
                Submit
              </button>
            </form>
          )}
        </Form>
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

const Friend = () => (
  <div>
    <h2>Friend</h2>
    <label>
      First name <Text field="firstName" />
    </label>
    <label>
      Last name <Text field="lastName" />
    </label>
  </div>
)

class ArrayOfNestedFields extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4">Array of nested fields</h2>
        <p>React Form also allows you to create an array of nested fields! How cool is that!</p>
        <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
          {formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form3">
                <NestedField field={['friends', 0]} component={Friend} />
                <NestedField field={['friends', 1]} component={Friend} />
                <NestedField field={['friends', 2]} component={Friend} />
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
              </form>
              <br />
              <Data title="Values" reference="formApi.values" data={formApi.values} />
              <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
              <Data
                title="Submission attempts"
                reference="formApi.submits"
                data={formApi.submits}
              />
              <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
              <Data
                title="Submitted values"
                reference="onSubmit={submittedValues => this.setState( { submittedValues } )}"
                data={this.state.submittedValues}
              />
            </div>
          )}
        </Form>
        <br />
        <NestedFieldArrayCode />
      </div>
    )
  }
}

export default ArrayOfNestedFields
