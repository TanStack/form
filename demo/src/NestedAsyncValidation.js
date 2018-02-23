/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Text, NestedField } from '../../src/'

/* ---------------- Other Imports ------------------ */

import Data from './Data'
import Code from './Code'

/* ------------------ Form Stuff --------------------*/

const NestedAsynchronousValidationCode = () => {
  const code = `
  import { Form, Text, NestedField } from 'react-form';

  const validator = username => (
    !username || username.trim() === ''
      ? 'Username is a required field'
      : { success: 'Awesome! your username is good to go!' }
  )

  const doesUsernameExist = (username, ms) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        // Simulate username check
        if (['joe', 'tanner', 'billy', 'bob'].includes(username)) {
          return resolve('That username is taken')
        }
        // Simulate request faulure
        if (username === 'reject') {
          return reject('Failure while making call to validate username does not exist')
        }
        // Sumulate username success check
        resolve()
      }, ms)
    )

  const asyncValidator = delay => async username => doesUsernameExist(username, delay)

  <Form
    render={formApi => (
      <form onSubmit={formApi.submitForm} id="form7">
        <label htmlFor="username2">Username</label>
        <Text
          field="username" id="username2"
          validate={validator}
          asyncValidate={asyncValidator(2000)} />
        <NestedField field="nested">
          <div>
            <label htmlFor="username3">Nested Username</label>
            <Text
              field="username" id="username3"
              validate={validator}
              asyncValidate={asyncValidator(4000)} />
            <NestedField field="deepNested">
              <div>
                <label htmlFor="username4">Deep nested Username</label>
                <Text
                  field="username" id="username4"
                  validate={validator}
                  asyncValidate={asyncValidator(6000)} />
              </div>
            </NestedField>
          </div>
        </NestedField>
        <button type="submit" className="mb-4 btn btn-primary">
          Submit
        </button>
      </form>
    )}
  />

  `

  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="html">{code}</Code>
    </div>
  )
}

const validator = username => (
  !username || username.trim() === ''
    ? 'Username is a required field'
    : { success: 'Awesome! your username is good to go!' }
)

const doesUsernameExist = (username, ms) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      // Simulate username check
      if (['joe', 'tanner', 'billy', 'bob'].includes(username)) {
        return resolve('That username is taken')
      }
      // Simulate request faulure
      if (username === 'reject') {
        return reject('Failure while making call to validate username does not exist')
      }
      // Sumulate username success check
      resolve()
    }, ms)
  )

const asyncValidator = delay => async username => doesUsernameExist(username, delay)

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
          render={formApi => (
            <div>
              <form onSubmit={formApi.submitForm} id="form7">
                <label htmlFor="username2">Username</label>
                <Text
                  field="username" id="username2"
                  validate={validator}
                  asyncValidate={asyncValidator(2000)} />
                <NestedField field="nested">
                  <div>
                    <label htmlFor="username3">Nested Username</label>
                    <Text
                      field="username" id="username3"
                      validate={validator}
                      asyncValidate={asyncValidator(4000)} />
                    <NestedField field="deepNested">
                      <div>
                        <label htmlFor="username4">Deep nested Username</label>
                        <Text
                          field="username" id="username4"
                          validate={validator}
                          asyncValidate={asyncValidator(6000)} />
                      </div>
                    </NestedField>
                  </div>
                </NestedField>
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
              </form>
              <br />
              <Data title="Values" reference="formApi.values" data={formApi.values} />
              <Data title="Errors" reference="formApi.errors" data={formApi.errors} />
              <Data title="Success" reference="formApi.successes" data={formApi.successes} />
              <Data title="AsyncErrors" reference="formApi.asyncErrors" data={formApi.asyncErrors} />
              <Data title="AsyncSuccess" reference="formApi.asyncSuccesses" data={formApi.asyncSuccesses} />
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
              <Data
                title="Submission attempts"
                reference="formApi.submits"
                data={formApi.submits}
              />
              <Data title="Submitted" reference="formApi.submitted" data={formApi.submitted} />
            </div>
          )}
        />
        <br />
        <NestedAsynchronousValidationCode />
      </div>
    )
  }
}

export default NestedAsynchronousValidation
