/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text,
  Radio,
  RadioGroup,
  TextArea,
  Select,
  Checkbox
} from '../src/index';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const Radios = ({ group }) => {
  return (
    <div>
      <label htmlFor="male" className="mr-2">Male</label>
      <Radio group={group} value="male" id="male" className="mr-3 d-inline-block" />
      <label htmlFor="female" className="mr-2">Female</label>
      <Radio group={group} value="female" id="female" className="d-inline-block" />
    </div>
  );
};

const FormContent = ({ formApi, submittedValues }) => {

  const statusOptions = [
    {
      label: 'Single',
      value: 'single'
    },
    {
      label: 'In a Relationship',
      value: 'relationship'
    },
    {
      label: "It's Complicated",
      value: 'complicated'
    }
  ];

  return (
    <div>
      <form onSubmit={formApi.submitForm} id="form2">
        <label htmlFor="firstName">First name</label>
        <Text field="firstName" id="firstName" />
        <label htmlFor="lastName">Last name</label>
        <Text field="lastName" id="lastName" />
        <RadioGroup field="gender">
          <Radios />
        </RadioGroup>
        <label htmlFor="bio">Bio</label>
        <TextArea field="bio" id="bio" />
        <label htmlFor="authorize" className="mr-2">Authorize</label>
        <Checkbox field="authorize" id="authorize" className="d-inline-block" />
        <label htmlFor="status" className="d-block">Relationship status</label>
        <Select field="status" id="status" options={statusOptions} className="mb-4" />
        <button type="submit" className="mb-4 btn btn-primary">Submit</button>
      </form>
      <br />
      <Data title="Values" reference="formApi.values" data={formApi.values} />
      <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
      <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
      <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
      <Data title="Submitted values" reference="onSubmit={submittedValues => this.setState( { submittedValues } )}" data={submittedValues} />
    </div>
  );

};

const BasicFormCode = () => {

  const code = `
  import { Form, Text, Radio, RadioGroup, Select, Checkbox } from 'react-savage-form';

  const Radios = ({ group }) => {
    return (
      <div>
        <label htmlFor="male" className="mr-2">Male</label>
        <Radio group={group} value="male" id="male" className="mr-3 d-inline-block" />
        <label htmlFor="female" className="mr-2">Female</label>
        <Radio group={group} value="female" id="female" className="d-inline-block" />
      </div>
    );
  };

  const FormContent = ({ formApi }) => {

    const statusOptions = [
      {
        label: 'Single',
        value: 'single'
      },
      {
        label: 'In a Relationship',
        value: 'relationship'
      },
      {
        label: "It's Complicated",
        value: 'complicated'
      }
    ];

    return (
      <div>
        <form onSubmit={formApi.submitForm} id="form2">
          <label htmlFor="firstName">First name</label>
          <Text field="firstName" id="firstName" />
          <label htmlFor="lastName">Last name</label>
          <Text field="lastName" id="lastName" />
          <RadioGroup field="gender">
            <Radios />
          </RadioGroup>
          <TextArea field="bio" id="bio" />
          <TextArea field="bio" />
          <label htmlFor="authorize" className="mr-2">Authorize</label>
          <Checkbox field="authorize" id="authorize" className="d-inline-block" />
          <label htmlFor="status" className="d-block">Relationship status</label>
          <Select field="status" id="status" options={statusOptions} />
          <button type="submit" className="mb-4 btn btn-primary">Submit</button>
        </form>
      </div>
    );
  };


  class BasicForm extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    render() {
      return (
        <div>
          <Form onSubmit={submittedValues => this.setState( { submittedValues } )}>
            <FormContent />
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

class BasicForm extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Basic Form</h2>
        <p>Here is an example of a basic form that has various input types.</p>
        <Form
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          <FormContent submittedValues={this.state.submittedValues} />
        </Form>
        <br />
        <BasicFormCode />
      </div>
    );
  }
}

export default BasicForm;
