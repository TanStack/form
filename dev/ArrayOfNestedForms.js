/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text,
  NestedForm
} from '../src/index';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const NestedFormArrayCode = () => {

  const code = `
  import { Form, Text, NestedForm } from 'react-form';

  const Friend = ({ i }) => (
    <NestedForm field={['friends', i]} key={\`nested-friend-\${i}\`}>
      <Form>
        { formApi => (
          <div>
            <h2>Friend</h2>
            <label htmlFor={\`nested-friend-first-\${i}\`}>First name</label>
            <Text field="firstName" id={\`nested-friend-first-\${i}\`} />
            <label htmlFor={\`nested-friend-last-\${i}\`}>Last name</label>
            <Text field="lastName" id={\`nested-friend-last-\${i}\`} />
          </div>
        )}
      </Form>
    </NestedForm>
  );

  class FormWithArrayOfNestedForms extends Component {

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
              <div>
                <form onSubmit={formApi.submitForm} id="form3">
                  <Friend i={0} />
                  <Friend i={1} />
                  <Friend i={2} />
                  <button type="submit" className="mb-4 btn btn-primary">Submit</button>
                </form>
              </div>
            )}
          </Form>
        </div>
      );
    }
  }
`;

  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="html">
        {code}
      </Code>
    </div>
  );
};

const Friend = ({ i }) => (
  <NestedForm field={['friends', i]} key={`nested-friend-${i}`}>
    <Form>
      { formApi => (
        <div>
          <h2>Friend</h2>
          <label htmlFor={`nested-friend-first-${i}`}>First name</label>
          <Text field="firstName" id={`nested-friend-first-${i}`} />
          <label htmlFor={`nested-friend-last-${i}`}>Last name</label>
          <Text field="lastName" id={`nested-friend-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

class ArrayOfNestedForms extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Array of nested forms</h2>
        <p>
          React Form also allows you to create an array of nested foms! How cool is that!
        </p>
        <Form
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          { formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form3">
                <Friend i={0} />
                <Friend i={1} />
                <Friend i={2} />
                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
              </form>
              <br />
              <Data title="Values" reference="formApi.values" data={formApi.values} />
              <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
              <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
              <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
              <Data title="Submitted values" reference="onSubmit={submittedValues => this.setState( { submittedValues } )}" data={this.state.submittedValues} />
            </div>
          )}
        </Form>
        <br />
        <NestedFormArrayCode />
      </div>
    );
  }
}

export default ArrayOfNestedForms;
