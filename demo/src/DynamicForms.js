/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text
} from '../../src/';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const DynamicFormsCode = () => {

  const code = `
  import { Form, Text } from '../../src';

  class DynamicForm extends Component {

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
                <button
                  onClick={() => formApi.addValue('siblings', '')}
                  type="button"
                  className="mb-4 mr-4 btn btn-success">Add Sibling</button>
                <form onSubmit={formApi.submitForm} id="dynamic-form">
                  <label htmlFor="dynamic-first">First name</label>
                  <Text field="firstName" id="dynamic-first" />
                  { formApi.values.siblings && formApi.values.siblings.map( ( sibling, i ) => (
                    <div key={\`sibling\${i}\`}>
                      <label htmlFor={\`sibling-name-\${i}\`}>Name</label>
                      <Text field={['siblings', i]} id={\`sibling-name-\${i}\`} />
                      <button
                        onClick={() => formApi.removeValue('siblings', i)}
                        type="button"
                        className="mb-4 btn btn-danger">Remove</button>
                    </div>
                  ))}
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

class DynamicForms extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Dynamic forms</h2>
        <p>
          You will probably run into use cases where you need to create forms
          that are dynamic. This can also be done with react-form!
        </p>
        <p>
          <strong>Note:</strong> the add and remove functions used in the example
          below are limited to adding and removing fields from a array field.
        </p>
        <Form
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          { formApi => (
            <div>
              <button
                onClick={() => formApi.addValue('siblings', '')}
                type="button"
                className="mb-4 mr-4 btn btn-success">Add Sibling</button>
              <form onSubmit={formApi.submitForm} id="dynamic-form">
                <label htmlFor="dynamic-first">First name</label>
                <Text field="firstName" id="dynamic-first" />
                { formApi.values.siblings && formApi.values.siblings.map( ( sibling, i ) => (
                  <div key={`sibling${i}`}>
                    <label htmlFor={`sibling-name-${i}`}>Name</label>
                    <Text field={['siblings', i]} id={`sibling-name-${i}`} />
                    <button
                      onClick={() => formApi.removeValue('siblings', i)}
                      type="button"
                      className="mb-4 btn btn-danger">Remove</button>
                  </div>
                ))}
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
        <DynamicFormsCode />
      </div>
    );
  }
}

export default DynamicForms;
