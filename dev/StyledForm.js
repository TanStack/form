/* ------------- Imports -------------- */
import React, { Component } from 'react';

import { HashLink as Link } from 'react-router-hash-link';

import { PrismCode } from 'react-prism';

import rawStyles from 'raw-loader!./styled-input-styles.txt';


/* ------------- Form  Library Imports -------------- */
import {
  Form,
  StyledText,
  StyledRadio,
  StyledRadioGroup,
  StyledTextArea,
  StyledSelect,
  StyledCheckbox
} from '../src/index';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const StyledInputProps = () => {
  return (
    <div>
      <h3 className="mb-4" id="styled-input-props">Styled Input Props</h3>
      <table className="table" style={{ tableLayout: 'fixed' }}>
        <thead className="thead-inverse">
          <tr>
            <th style={{ width: '180px' }}>Name</th>
            <th style={{ width: '100px' }}>Type</th>
            <th style={{ width: '100px' }}>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><code>noMessage</code></th>
            <td><pre>bool</pre></td>
            <td>no</td>
            <td>Pass this in if you dont want a message showing up in an error, warning, or success state.</td>
          </tr>
          <tr>
            <th scope="row"><code>messageBefore</code></th>
            <td><pre>bool</pre></td>
            <td>no</td>
            <td>Pass this in if you want the error, warning, or success message to show up above the field.</td>
          </tr>
          <tr>
            <th scope="row"><code>touchValidation</code></th>
            <td><pre>bool</pre></td>
            <td>no</td>
            <td>Pass this in when you dont want validation styles to get applied until the field has been touched.</td>
          </tr>
          <tr>
            <th scope="row"><code>valueValidation</code></th>
            <td><pre>bool</pre></td>
            <td>no</td>
            <td>
              Pass this in when you dont want validation styles to get applied until a value exists in the field.
              For example, if you pass this into a text field it will not show validation until you type something.
            </td>
          </tr>
          <tr>
            <th scope="row"><code>label</code></th>
            <td><pre>string</pre></td>
            <td>no</td>
            <td>
              This is only to be used for radios and check boxes. Because the radio and checkbox inputs
              are special controled inputs they have labels internally, so pass in the label prop to render a label.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const StyledFormCode = () => {

  const code = `
  import {
    Form,
    StyledText,
    StyledTextArea,
    StyledRadio,
    StyledRadioGroup,
    StyledSelect,
    StyledCheckbox
  } from 'react-form';

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

  class StyledForm extends Component {

    constructor( props ) {
      super( props );
      this.state = {};
    }

    errorValidator = ( values ) => {
      const validateFirstName = ( firstName ) => {
        return !firstName ? 'First name is required.' : null;
      };
      const validateLastName = ( lastName ) => {
        return !lastName ? 'Last name is required.' : null;
      };
      const validateGender = ( gender ) => {
        return !gender ? 'Gender is required.' : null;
      };
      const validateBio = ( bio ) => {
        return !bio ? 'Bio is required.' : null;
      };
      const validateAuthorize = ( authorize ) => {
        return !authorize ? 'Please check authorize.' : null;
      };
      const validateStatus = ( status ) => {
        return !status ? 'Status is required.' : null;
      };
      return {
        firstName: validateFirstName( values.firstName ),
        lastName: validateLastName( values.lastName ),
        gender: validateGender( values.gender ),
        bio: validateBio( values.bio ),
        authorize: validateAuthorize( values.authorize ),
        status: validateStatus( values.status )
      };
    }

    warningValidator = ( values ) => {
      const validateFirstName = ( firstName ) => {
        return firstName && firstName.length < 2 ? 'First name must be longer than 2 characters.' : null;
      };
      const validateLastName = ( lastName ) => {
        return lastName && lastName.length < 2 ? 'Last name must be longer than 2 characters.' : null;
      };
      const validateBio = ( bio ) => {
        return bio && bio.replace(/\s+/g, ' ').trim().split(' ').length < 5 ? 'Bio should have more than 5 words.' : null;
      };
      return {
        firstName: validateFirstName( values.firstName ),
        lastName: validateLastName( values.lastName ),
        gender: null,
        bio: validateBio( values.bio ),
        authorize: null,
        status: null
      };
    }

    successValidator = ( values, errors ) => {
      const validateFirstName = ( ) => {
        return !errors.firstName ? 'Nice name!' : null;
      };
      const validateLastName = ( ) => {
        return !errors.lastName ? 'Your last name is sick!' : null;
      };
      const validateGender = ( ) => {
        return !errors.gender ? 'Thanks for entering your gender.' : null;
      };
      const validateBio = ( ) => {
        return !errors.bio ? 'Cool Bio!' : null;
      };
      const validateAuthorize = ( ) => {
        return !errors.authorize ? 'You are now authorized.' : null;
      };
      const validateStatus = ( ) => {
        return !errors.status ? 'Thanks for entering your status.' : null;
      };
      return {
        firstName: validateFirstName( values.firstName ),
        lastName: validateLastName( values.lastName ),
        gender: validateGender( values.gender ),
        bio: validateBio( values.bio ),
        authorize: validateAuthorize( values.authorize ),
        status: validateStatus( values.status )
      };
    }

    <Form
      validateError={this.errorValidator}
      validateWarning={this.warningValidator}
      validateSuccess={this.successValidator}
      onSubmit={submittedValues => this.setState( { submittedValues } )}>
      { formApi => (
        <form onSubmit={formApi.submitForm} id="form2">
          <label htmlFor="firstName">First name</label>
          <StyledText field="firstName" id="firstName" />
          <label htmlFor="lastName">Last name</label>
          <StyledText field="lastName" id="lastName" />
          <label>Choose Gender</label>
          <StyledRadioGroup field="gender">
            { group => (
              <div>
                <StyledRadio group={group} value="male" id="male" label="Male" className="mr-3 d-inline-block" />
                <StyledRadio group={group} value="female" id="female" label="Female" className="d-inline-block" />
              </div>
            )}
          </StyledRadioGroup>
          <label htmlFor="bio">Bio</label>
          <StyledTextArea field="bio" id="bio" />
          <StyledCheckbox field="authorize" id="authorize" label="Authorize" className="d-inline-block" />
          <label htmlFor="status" className="d-block">Relationship status</label>
          <StyledSelect field="status" id="status" options={statusOptions} />
          <button type="submit" className="mb-4 btn btn-primary">Submit</button>
        </form>
      )}
    </Form>
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

class StyledForm extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  errorValidator = ( values ) => {
    const validateFirstName = ( firstName ) => {
      return !firstName ? 'First name is required.' : null;
    };
    const validateLastName = ( lastName ) => {
      return !lastName ? 'Last name is required.' : null;
    };
    const validateGender = ( gender ) => {
      return !gender ? 'Gender is required.' : null;
    };
    const validateBio = ( bio ) => {
      return !bio ? 'Bio is required.' : null;
    };
    const validateAuthorize = ( authorize ) => {
      return !authorize ? 'Please check authorize.' : null;
    };
    const validateStatus = ( status ) => {
      return !status ? 'Status is required.' : null;
    };
    return {
      firstName: validateFirstName( values.firstName ),
      lastName: validateLastName( values.lastName ),
      gender: validateGender( values.gender ),
      bio: validateBio( values.bio ),
      authorize: validateAuthorize( values.authorize ),
      status: validateStatus( values.status )
    };
  }

  warningValidator = ( values ) => {
    const validateFirstName = ( firstName ) => {
      return firstName && firstName.length < 2 ? 'First name must be longer than 2 characters.' : null;
    };
    const validateLasttName = ( lastName ) => {
      return lastName && lastName.length < 2 ? 'Last name must be longer than 2 characters.' : null;
    };
    const validateBio = ( bio ) => {
      return bio && bio.replace(/\s+/g, ' ').trim().split(' ').length < 5 ? 'Bio should have more than 5 words.' : null;
    };
    return {
      firstName: validateFirstName( values.firstName ),
      lastName: validateLasttName( values.lastName ),
      gender: null,
      bio: validateBio( values.bio ),
      authorize: null,
      status: null
    };
  }

  successValidator = ( values, errors ) => {
    const validateFirstName = ( ) => {
      return !errors.firstName ? 'Nice name!' : null;
    };
    const validateLastName = ( ) => {
      return !errors.lastName ? 'Your last name is sick!' : null;
    };
    const validateGender = ( ) => {
      return !errors.gender ? 'Thanks for entering your gender.' : null;
    };
    const validateBio = ( ) => {
      return !errors.bio ? 'Cool Bio!' : null;
    };
    const validateAuthorize = ( ) => {
      return !errors.authorize ? 'You are now authorized.' : null;
    };
    const validateStatus = ( ) => {
      return !errors.status ? 'Thanks for entering your status.' : null;
    };
    return {
      firstName: validateFirstName( values.firstName ),
      lastName: validateLastName( values.lastName ),
      gender: validateGender( values.gender ),
      bio: validateBio( values.bio ),
      authorize: validateAuthorize( values.authorize ),
      status: validateStatus( values.status )
    };
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Styled Form</h2>
        <p>
          React Form also comes bundled with a basic set of styled inputs.
          Styled inputs will automatically add classes to the internal
          <code>input</code>, <code>radio</code>, <code>select</code> ... etc elements.
        </p>
        <p>
          Below is an example of a styled form that has various styled inputs.
          Note, these inputs look the way they do because of the stylesheet that
          can be seen at the bottom of this page. In order to keep things simple,
          <code>react-form</code> does <strong>NOT</strong> come bundled with any css.
          If you want to use styled inputs, you must create your own stylesheet, and style
          the inputs via the classes that are added by react form.
        </p>
        <p>
          A good starting point would be to copy the <code>.scss</code> file from the
          <Link to="#react-form-scss"> bottom of this page</Link>. It serves as a
          perfect example on how you can use the classes to style your components.
        </p>
        <p>
          <strong>Note:</strong> in many cases styled inputs are not enough for developers needs.
          You will more than likeley find yourselves needing more customization very quikly. If this
          is the case, we highly recommend you create your own <strong>Custom Form Fields</strong>.
          See the <Link to="/custom-input">custom inputs section</Link> in the documentation for more details.
        </p>
        <p>
          For information on what props are availible see the <Link to="#styled-input-props">styled input props</Link> section.
        </p>
        <p>
          Now go ahead and play with this form!
        </p>
        <Form
          validateError={this.errorValidator}
          validateWarning={this.warningValidator}
          validateSuccess={this.successValidator}
          onSubmit={submittedValues => this.setState( { submittedValues } )}>
          { formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form2">
                <label htmlFor="firstName">First name</label>
                <StyledText field="firstName" id="firstName" />
                <label htmlFor="lastName">Last name</label>
                <StyledText field="lastName" id="lastName" />
                <label>Choose Gender</label>
                <StyledRadioGroup field="gender">
                  { group => (
                    <div>
                      <StyledRadio group={group} value="male" id="male" label="Male" className="mr-3 d-inline-block" />
                      <StyledRadio group={group} value="female" id="female" label="Female" className="d-inline-block" />
                    </div>
                  )}
                </StyledRadioGroup>
                <label htmlFor="bio">Bio</label>
                <StyledTextArea field="bio" id="bio" />
                <StyledCheckbox field="authorize" id="authorize" label="Authorize" className="d-inline-block" />
                <label htmlFor="status" className="d-block">Relationship status</label>
                <StyledSelect field="status" id="status" options={statusOptions} />
                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
              </form>
              <br />
              <Data title="Values" reference="formApi.values" data={formApi.values} />
              <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
              <Data title="Errors" reference="formApi.errors" data={formApi.errors} />
              <Data title="Warnings" reference="formApi.warnings" data={formApi.warnings} />
              <Data title="Successes" reference="formApi.successes" data={formApi.successes} />
              <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
              <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
              <Data title="Submitted values" reference="onSubmit={submittedValues => this.setState( { submittedValues } )}" data={this.state.submittedValues} />
            </div>
          )}
        </Form>
        <br />
        <StyledFormCode />
        <hr /><br />
        <StyledInputProps />
        <hr /><br />
        <h3 className="mb-4" id="react-form-scss">React Form <code>.scss</code></h3>
        <p>
          Below is the stylesheet that was used to style the form above.
          This is a good starting point if you dont want to write a bunch of styles from scratch.
          Note, styleing radio buttons, checkboxes, and selects sucks! React form also applies
          what is commonly reffered to as custom <code>control</code> input classes to the
          radios and checkboxes. The stylesheet below takes advantage of these classes to
          implement custom radios and checkboxes.
        </p>
        <p>
          Basically all styled inputs have two classes on them by default.
        </p>
        <ol>
          <li><code>react-form-input</code></li>
          <li><code>react-form-{'<input-type-here>'}</code></li>
        </ol>
        <p>
          For example, the <code>StyledText</code> component will have the class <code>react-form-text</code>.
        </p>
        <p>
          When a stlyed input goes into an error, warning, or success state; the classes
          <code>react-form-input-error</code>, <code>react-form-input-warning</code>,
          or <code>react-form-input-success</code> are applied respectively. Additionally,
          <code>react-form-input-{'<input-type>'}-error</code>, <code>react-form-{'<input-type>'}-warning</code>,
          or <code>react-form-{'<input-type>'}-success</code> are also applied respectively.
        </p>
        <pre className="mb-4">
          <PrismCode className="language-css">
            {rawStyles}
          </PrismCode>
        </pre>
      </div>
    );
  }
}

export default StyledForm;
