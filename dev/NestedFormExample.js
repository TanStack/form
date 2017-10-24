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

let nestedFormApi = {};

const Questions = () => (
  <NestedForm field="questions">
    <Form>
      { ( formApi ) => {
        nestedFormApi = formApi;
        return (
          <div>
            <label htmlFor="color">Whats your favorite color?</label>
            <Text field="color" id="color" />
            <label htmlFor="food">Whats your favorite food?</label>
            <Text field="food" id="food" />
            <label htmlFor="car">Whats type of car do you drive?</label>
            <Text field="car" id="car" />
          </div>
        );
      }}
    </Form>
  </NestedForm>
);

const FormContent = ({ formApi, submittedValues }) => {

  return (
    <div>
      <form onSubmit={formApi.submitForm} id="form4">
        <label htmlFor="firstName3">First name</label>
        <Text field="firstName" id="firstName3" />
        <Questions />
        <button type="submit" className="mb-4 btn btn-primary">Submit</button>
      </form>
      <br />
      <div className="row mb-4">
        <div className="col-sm-6">
          <h4>Full form properties</h4>
        </div>
        <div className="col-sm-6">
          <h4>Nested form properties</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Data title="Values" reference="formApi.values" data={formApi.values} />
        </div>
        <div className="col-sm-6">
          <Data title="Values" reference="nestedFormsApi.values" data={nestedFormApi.values} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
        </div>
        <div className="col-sm-6">
          <Data title="Touched" reference="nestedFormsApi.touched" data={nestedFormApi.touched} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
        </div>
        <div className="col-sm-6">
          <Data title="Submission attempts" reference="nestedFormsApi.submits" data={nestedFormApi.submits} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
        </div>
        <div className="col-sm-6">
          <Data title="Submitted" reference="nestedFormsApi.submitted" data={nestedFormApi.submitted} />
        </div>
      </div>
      <Data title="Submitted values" reference="onSubmit={submittedValues => this.setState( { submittedValues } )}" data={submittedValues} />
    </div>
  );

};

const NestedFormCode = () => {

  const code = `
  import { Form, Text, NestedForm } from 'react-form';

  const Questions = () => (
    <NestedForm field="questions">
      <Form>
        { formApi => (
          <div>
            <label htmlFor="color">Whats your favorite color?</label>
            <Text field="color" id="color" />
            <label htmlFor="food">Whats your favorite food?</label>
            <Text field="food" id="food" />
            <label htmlFor="car">Whats type of car do you drive?</label>
            <Text field="car" id="car" />
          </div>
        )}
      </Form>
    </NestedForm>
  );

  class NestedFormExample extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    render() {
      return (
        <div>
          <Form onSubmit={submittedValues => this.setState( { submittedValues } )}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form4">
                <label htmlFor="firstName3">First name</label>
                <Text field="firstName" id="firstName3" />
                <Questions />
                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
              </form>
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

class NestedFormExample extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Nested Forms</h2>
        <p>
          You can also choose to create nested forms. This can become very
          usefull for complex forms. Nested forms should always have one child,
          a <code>&lt;Form&gt;</code> component. <code>&lt;Form&gt;</code>s within
          a <code>&lt;NestedForm&gt;</code> have all the same properties as a normal
          <code>&lt;Form&gt;</code>
        </p>
        <Form
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          <FormContent submittedValues={this.state.submittedValues} />
        </Form>
        <br />
        <NestedFormCode />
      </div>
    );
  }
}

export default NestedFormExample;
