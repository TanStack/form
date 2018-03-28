/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, NestedField, withFieldApi } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const QuestionFields = () => (
  <div>
    <label htmlFor="color">Whats your favorite color?</label>
    <Text field="color" id="color" />
    <label htmlFor="food">Whats your favorite food?</label>
    <Text field="food" id="food" />
    <label htmlFor="car">Whats type of car do you drive?</label>
    <Text field="car" id="car" />
  </div>
)

const NestedFormCode = () => {
  const code = `
  import { Form, Text, NestedField } from 'react-form';

  const QuestionFields = () => (
    <div>
      <label htmlFor="color">Whats your favorite color?</label>
      <Text field="color" id="color" />
      <label htmlFor="food">Whats your favorite food?</label>
      <Text field="food" id="food" />
      <label htmlFor="car">Whats type of car do you drive?</label>
      <Text field="car" id="car" />
    </div>
  )

  class NestedFieldExample extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    render() {
      return (
        <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="form4">
              <label htmlFor="firstName3">First name</label>
              <Text field="firstName" id="firstName3" />
              <NestedField field="questions">
                <QuestionFields />
              </NestedField>
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

const AButton =({ fieldApi }) => {
  return (
    <button type="button" className="mb-4 btn btn-primary" onClick={()=>fieldApi.setValue({color: 'blue'})}>
      ASDF
    </button>
  )
}

const AButtonWithFieldApi = withFieldApi('questions')(AButton)

class NestedFormExample extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4">Nested Fields</h2>
        <p>
          You can also choose to create nested fields. This can become very usefull for complex
          forms. <code>NestedFields</code> allow you to put all child fields in the context of that
          nested field. This makes way more sense when you see an example:
        </p>
        <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
          {formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form4">
                <label htmlFor="firstName3">First name</label>
                <Text field="firstName" id="firstName3" />
                <NestedField
                  field="questions"
                  validate={values => ({
                    color: values && values.color === 'red' && 'No red please!',
                    food: values &&
                      values.food === 'pizza' && {
                      error: 'No pizza please!',
                      warning: 'Try another food!'
                    }
                  })}
                >
                  <QuestionFields />
                </NestedField>
                {/* <label htmlFor="questions.foo">First name</label>
                <Text field="questions.foo" id="questions.foo" /> */}
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
                <AButtonWithFieldApi />
              </form>
              <br />
              <Data title="Values" reference="formApi.values" data={formApi.values} />
              <Data title="Errors" reference="formApi.errors" data={formApi.errors} />
              <Data title="Warnings" reference="formApi.warnings" data={formApi.warnings} />
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
        <NestedFormCode />
      </div>
    )
  }
}

export default NestedFormExample
