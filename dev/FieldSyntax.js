/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text
} from '../src/index';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const FormWithSpecialFieldSyntaxCode = () => {

  const code = `
  import { Form, Text } from 'react-form';

  const Friend = ({ i }) => (
    <div>
      <h2>Friend</h2>
      <label htmlFor={\`friend-first-\${i}\`}>First name</label>
      <Text field={['friends', i, 'firstName']} id={\`friend-first-\${i}\`} />
      <label htmlFor={\`friend-last-\${i}\`}>Last name</label>
      <Text field={\`friends.\${i}.lastName\`} id={\`friend-last-\${i}\`} />
      <label htmlFor={\`friend-street-\${i}\`}>Street</label>
      <Text field={['friends', i, 'address', 'street']} id={\`friend-street-\${i}\`} />
      <label htmlFor={\`friend-zip-\${i}\`}>Zipcode</label>
      <Text field={\`friends.\${i}.address.zip\`} id={\`friend-zip-\${i}\`} />
    </div>
  );

  class FormWithSpecialFieldSyntax extends Component {

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
              <form onSubmit={formApi.submitForm} id="syntax-form">
                <label htmlFor="nickname1">Nickname</label>
                <Text field={['nicknames', 0]} id="nickname1" />
                <label htmlFor="nickname2">Nickname</label>
                <Text field={['nicknames', 1]} id="nickname2" />
                <Friend i={0} />
                <Friend i={1} />
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

const Friend = ({ i }) => (
  <div>
    <h2>Friend</h2>
    <label htmlFor={`friend-first-${i}`}>First name</label>
    <Text field={['friends', i, 'firstName']} id={`friend-first-${i}`} />
    <label htmlFor={`friend-last-${i}`}>Last name</label>
    <Text field={`friends.${i}.lastName`} id={`friend-last-${i}`} />
    <label htmlFor={`friend-street-${i}`}>Street</label>
    <Text field={['friends', i, 'address', 'street']} id={`friend-street-${i}`} />
    <label htmlFor={`friend-zip-${i}`}>Zipcode</label>
    <Text field={`friends.${i}.address.zip`} id={`friend-zip-${i}`} />
  </div>
);

class FormWithSpecialFieldSyntax extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Field syntax</h2>
        <p>
          Every input in <code>react-form</code> needs an associated field name.
          In its simplest form, field names are just strings. However, somtimes
          you may have some complex forms that require special ways of organizing
          your fields, this is where the special syntax comes in.
        </p>
        <p>
          Fields can be simple <code>strings</code>, <code>arrays</code>,
          or strings that contain <code>"."</code> seperating information.
          Below are some examples of field names.
        </p>
        <ul>
          <li><code>"username"</code></li>
          <li><code>["friends", 0 ]</code></li>
          <li><code>["friends", 0, "firstName" ]</code></li>
          <li><code>"friends.0.lastName"</code></li>
          <li><code>["friends", 0, "address", "street" ]</code></li>
          <li><code>"friends.0.address.street"</code></li>
        </ul>
        <p className="mb-4">
          <strong>Note:</strong> I would highly recomend that if you find yourself writing code
          that contains <code>["friends", 0, "address", "street" ]</code> that
          you think about using nested forms instead. In fact i would even recomend
          using nested forms when you find yourself writing <code>["friends", 0, "firstName" ]</code>.
          Do yourself this favor and you will have cleaner more consumable code!!
        </p>
        <h3 className="mb-4">Example</h3>
        <Form
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          { formApi => (
            <div>
              <div className="row">
                <div className="col-4">
                  <form onSubmit={formApi.submitForm} id="syntax-form">
                    <label htmlFor="nickname1">Nickname</label>
                    <Text field={['nicknames', 0]} id="nickname1" />
                    <label htmlFor="nickname2">Nickname</label>
                    <Text field={['nicknames', 1]} id="nickname2" />
                    <Friend i={0} />
                    <Friend i={1} />
                    <button type="submit" className="mb-4 btn btn-primary">Submit</button>
                  </form>
                </div>
                <div className="col-4">
                  <Data title="Values" reference="formApi.values" data={formApi.values} />
                </div>
                <div className="col-4">
                  <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
                </div>
              </div>
              <br />
              <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
              <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
              <Data title="Submitted values" reference="onSubmit={submittedValues => this.setState( { submittedValues } )}" data={this.state.submittedValues} />
            </div>
          )}
        </Form>
        <br />
        <FormWithSpecialFieldSyntaxCode />
      </div>
    );
  }
}

export default FormWithSpecialFieldSyntax;
