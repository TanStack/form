/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, FieldContext } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const NestedAsynchronousValidationCode = () => {
  const code = `
  import { Form, Text, NestedForm } from '../../src';

  const NestedNestedFormContent = ({ formApi }) => {
    return (
      <div>
        <label htmlFor="username4">Nested Username</label>
        <Text field="username" id="username4" />
      </div>
    );
  };

  const NestedFormContent = ({ formApi }) => {
    return (
      <div>
        <label htmlFor="username3">Nested Username</label>
        <Text field="username" id="username3" />
        <NestedForm field="nestednested">
          <Form
            validateError={errorValidator}
            validateSuccess={successValidator}
            asyncValidators={asyncValidators3}>
            <NestedNestedFormContent />
          </Form>
        </NestedForm>
      </div>
    );
  };

  const FormContent = ({ formApi }) => {

    return (
      <div>
        <form onSubmit={formApi.submitForm} id="form7">
          <label htmlFor="username2">Username</label>
          <Text field="username" id="username2" />
          <NestedForm field="nested">
            <Form
              validateError={errorValidator}
              validateSuccess={successValidator}
              asyncValidators={asyncValidators2}>
              <NestedFormContent />
            </Form>
          </NestedForm>
          <button type="submit" className="mb-4 btn btn-primary">Submit</button>
        </form>
      </div>
    );
  };

  const errorValidator = (values) => {
    return {
      username: !values.username || values.username.trim() === '' ? 'Username is a required field' : null
    };
  };

  const successValidator = (values, errors) => {
    return {
      username: !errors.username ? 'Awesome! your username is good to go!' : null
    };
  };

  const doesUsernameExist = ( username, ms ) => new Promise( ( resolve, reject ) => setTimeout(() => {
    // Simulate username check
    if (['joe', 'tanner', 'billy', 'bob'].includes(username)) {
      resolve( { error: 'That username is taken', success: null } );
    }
    // Simulate request faulure
    if ( username === 'reject' ) {
      reject('Failure while making call to validate username does not exist');
    }
    // Sumulate username success check
    resolve({});
  }, ms));

  const asyncValidators = {
    username: async ( username ) => {
      const validations = await doesUsernameExist( username, 2000 );
      return validations;
    }
  };

  const asyncValidators2 = {
    username: async ( username ) => {
      const validations = await doesUsernameExist( username, 4000 );
      return validations;
    }
  };

  const asyncValidators3 = {
    username: async ( username ) => {
      const validations = await doesUsernameExist( username, 6000 );
      return validations;
    }
  };

  class NestedAsynchronousFormValidation extends Component {
    render() {
      return (
        <div>
          <Form
            validateError={errorValidator}
            validateSuccess={successValidator}
            asyncValidators={asyncValidators}>
            <FormContent />
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

const errorValidator = values => ({
  username:
    !values.username || values.username.trim() === '' ? 'Username is a required field' : null
})

const successValidator = (values, errors) => ({
  username: !errors.username ? 'Awesome! your username is good to go!' : null
})

const doesUsernameExist = (username, ms) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      // Simulate username check
      if (['joe', 'tanner', 'billy', 'bob'].includes(username)) {
        resolve({ error: 'That username is taken', success: null })
      }
      // Simulate request faulure
      if (username === 'reject') {
        reject('Failure while making call to validate username does not exist')
      }
      // Sumulate username success check
      resolve({})
    }, ms)
  )

const asyncValidators = {
  username: async username => {
    const validations = await doesUsernameExist(username, 2000)
    return validations
  }
}

const asyncValidators2 = {
  username: async username => {
    const validations = await doesUsernameExist(username, 4000)
    return validations
  }
}

const asyncValidators3 = {
  username: async username => {
    const validations = await doesUsernameExist(username, 6000)
    return validations
  }
}

const NestedNestedFormContent = () => (
  <div>
    <label htmlFor="username4">Nested Username</label>
    <Text field="username" id="username4" />
  </div>
)

const NestedFormContent = () => (
  <div>
    <label htmlFor="username3">Nested Username</label>
    <Text field="username" id="username3" />
    <FieldContext field="nestednested" component={NestedNestedFormContent} />
  </div>
)

const FormContent = ({ formApi }) => (
  <div>
    <form onSubmit={formApi.submitForm} id="form7">
      <label htmlFor="username2">Username</label>
      <Text field="username" id="username2" />
      <FieldContext field="nested" component={NestedFormContent} />
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
    <br />
    <Data title="Values" reference="formApi.values" data={formApi.values} />
    <Data title="Touched" reference="formApi.touched" data={formApi.touched} />
    <Data title="Errors" reference="formApi.errors" data={formApi.errors} />
    <Data title="Success" reference="formApi.successes" data={formApi.successes} />
    <Data
      title="AsyncValidations"
      reference="formApi.asyncValidations"
      data={formApi.asyncValidations}
    />
    <Data title="Validating" reference="formApi.validating" data={formApi.validating} />
    <Data
      title="ValidationFailures"
      reference="formApi.validationFailures"
      data={formApi.validationFailures}
    />
    <Data
      title="ValidationFailed"
      reference="formApi.validationFailed"
      data={formApi.validationFailed}
    />
    <Data title="Submission attempts" reference="formApi.submits" data={formApi.submits} />
    <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
  </div>
)

class NestedAsynchronousValidation extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <h2 className="mb-4" id="async-validation">
          Nested Asynchronous Validation
        </h2>
        <p>We can even do nested async validation!</p>
        <p>Play around with the username fields and see how the form values react.</p>
        <p>
          <strong> Hint: </strong> the following usernames will fail validation:{' '}
          {'"joe", "tanner", "billy", and "bob"'}. You can also type {'"reject"'} in the field to
          see how the form reacts when the asynchronous validation failed ( as if 500 status code
          came back from your server ). The first field will take 2 seconds to validate, the second
          4, and the third 6 seconds.
        </p>
        <Form
          validateError={errorValidator}
          validateSuccess={successValidator}
          asyncValidators={asyncValidators}
        >
          <FormContent />
        </Form>
        <br />
        <NestedAsynchronousValidationCode />
      </div>
    )
  }
}

export default NestedAsynchronousValidation
