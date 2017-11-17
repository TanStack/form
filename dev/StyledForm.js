/* ------------- Imports -------------- */
import React, { Component } from 'react';

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

    render() {
      return (
        <div>
          <Form onSubmit={submittedValues => this.setState( { submittedValues } )}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form2">
                <label htmlFor="firstName">First name</label>
                <Text field="firstName" id="firstName" />
                <label htmlFor="lastName">Last name</label>
                <Text field="lastName" id="lastName" />
                <RadioGroup field="gender">
                  { group => (
                    <div>
                      <label htmlFor="male" className="mr-2">Male</label>
                      <Radio group={group} value="male" id="male" className="mr-3 d-inline-block" />
                      <label htmlFor="female" className="mr-2">Female</label>
                      <Radio group={group} value="female" id="female" className="d-inline-block" />
                    </div>
                  )}
                </RadioGroup>
                <label htmlFor="bio">Bio</label>
                <TextArea field="bio" id="bio" />
                <label htmlFor="authorize" className="mr-2">Authorize</label>
                <Checkbox field="authorize" id="authorize" className="d-inline-block" />
                <label htmlFor="status" className="d-block">Relationship status</label>
                <Select field="status" id="status" options={statusOptions} />
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
    const validateLasttName = ( lastName ) => {
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
      lastName: validateLasttName( values.lastName ),
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
      return bio && bio.replace(/\s+/g, ' ').trim().split(' ').length < 5 ? 'Bio must have more than 5 words.' : null;
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
    const validateLasttName = ( ) => {
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
      lastName: validateLasttName( values.lastName ),
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
        <p>Here is an example of a styled form that has various input types.</p>
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
                <StyledSelect field="status" id="status" options={statusOptions} className="mb-4" />
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
      </div>
    );
  }
}

export default StyledForm;
