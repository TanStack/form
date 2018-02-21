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
      <Text field={[['friends', i], 'lastName']} id={\`friend-last-\${i}\`} />
      <label htmlFor={\`friend-street-\${i}\`}>Street</label>
      <Text field={['friends', i, 'address', 'street']} id={\`friend-street-\${i}\`} />
      <label htmlFor={\`friend-zip-\${i}\`}>Zipcode</label>
      <Text field={['friends', i, 'lastName.zip']} id={\`friend-zip-\${i}\`} />
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
    <Text field={[['friends', i], 'lastName']} id={`friend-last-${i}`} />
    <label htmlFor={`friend-street-${i}`}>Street</label>
    <Text field={['friends', i, 'address', 'street']} id={`friend-street-${i}`} />
    <label htmlFor={`friend-zip-${i}`}>Zipcode</label>
    <Text field={['friends', i, 'address.zip']} id={`friend-zip-${i}`} />
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
          In its simplest form, field names are just strings. However, sometimes
          you may have some complex forms that require special ways of organizing
          your fields, this is where the special syntax comes in.
        </p>
        <p>
          Fields can be simple <code>strings</code>, <code>strings</code> that contain <code>"."</code>,
          and <code>strings</code> that contain <code>"[ ]"</code>, much like how you access and write to objects and
          arrays in javascript.
          You can also use <code>arrays</code> and even <code>nested arrays</code>
          that contain this syntax as well. This helps with deep form composition.
          Below are some examples of field names and what they resolve to in the forms values object.
        </p>
        <div className="mb-4">
          <table className="table" style={{ tableLayout: 'fixed' }}>
            <thead className="thead-inverse">
              <tr>
                <th>Input</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>"username"</code></td>
                <td><code>values.username</code></td></tr>
              <tr>
                <td><code>"friends[0]"</code></td>
                <td><code>values.friends[0]</code></td></tr>
              <tr>
                <td><code>["friends", 0]</code></td>
                <td><code>values.friends[0]</code></td></tr>
              <tr>
                <td><code>["friends", 0, "address"]</code></td>
                <td><code>values.friends[0].address</code></td></tr>
              <tr>
                <td><code>"friends[0].address"</code></td>
                <td><code>values.friends[0].address</code></td></tr>
              <tr>
                <td><code>["friends", 0, "address.street"]</code></td>
                <td><code>values.friends[0].address.street</code></td></tr>
              <tr>
                <td><code>[[["friends[0]", "address"], "street"], "alt"] &nbsp;</code></td>
                <td><code>values.friends[0].address.street.alt</code></td></tr>
              <tr>
                <td><code>"friends.0.address"</code></td>
                <td><code>values.friends.0.address</code></td></tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4">
          <strong>Note:</strong> I would highly recommend that if you find yourself writing code
          that contains <code>["friends", 0, "address", "street"]</code> that
          you think about using nested forms instead. In fact i would even recommend
          using nested forms when you find yourself writing <code>["friends", 0, "firstName"]</code>.
          Do yourself this favor and you will have cleaner more consumable code!!
        </p>
        <p className="mb-4">
          <strong>Warning:</strong> Be very aware that using numbers in dot-notation (eg. "friends.0.address")
          acts exactly as it would in javascript. This will set and get a <strong>property of an object</strong>,
          not the position in an array.
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
