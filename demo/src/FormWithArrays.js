/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const FormWithArraysCode = () => {
  const code = `
  import { Form, Text } from 'react-form';

  class FormWithArrays extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    render() {
      return (
        <div>
          <Form
            onSubmit={submittedValues => this.setState( { submittedValues } )}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form3">
                <label htmlFor="firstName2">First name</label>
                <Text field="firstName" id="firstName2" />
                <label htmlFor="friend1">Friend1</label>
                <Text field={['friends', 0]} id="friend1" />
                <label htmlFor="friend2">Friend2</label>
                <Text field={['friends', 1]} id="friend2" />
                <label htmlFor="friend3">Friend3</label>
                <Text field={['friends', 2]} id="friend3" />
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

class FormWithArrays extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4">Form With Array</h2>
        <p>
          Fields can also be associated with an array. Here is an example where you can input three
          friends.
        </p>
        <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
          {formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form3">
                <label htmlFor="firstName2">First name</label>
                <Text field="firstName" id="firstName2" />
                <label htmlFor="friend1">Friend1</label>
                <Text field={['friends', 0]} id="friend1" />
                <label htmlFor="friend2">Friend2</label>
                <Text field={['friends', 1]} id="friend2" />
                <label htmlFor="friend3">Friend3</label>
                <Text field={['friends', 2]} id="friend3" />
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
        <FormWithArraysCode />
      </div>
    )
  }
}

export default FormWithArrays
