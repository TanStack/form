import React from 'react'
import Form from '../src/form'
import Text from '../src/formInputs/text'

export default (
  <Form
    validate={({ name }) => {
      return {
        name: !name ? 'A name is required' : undefined
      }
    }}
  >
    {({submitForm}) => {
      return (
        <form onSubmit={submitForm}>
          <p>Submit event would have 3 objects: values, state and props.</p>
          <label>name:*</label>
          <Text field='name' placeholder='type something...' />
          <pre>By default validation performs on <b>blur</b> and <b>submit</b> events</pre>
          <button type='submit'>Submit</button>
        </form>
      )
    }}
  </Form>
)
