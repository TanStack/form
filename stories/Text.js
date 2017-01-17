import React from 'react'
//
import CodeHighlight from './components/codeHighlight.js'
import { Form, Text } from '../src/index'

export default () => (
  <Form
    validate={({ name }) => {
      return {
        name: !name ? 'A name is required' : undefined
      }
    }}
  >
    {({submitForm, values}) => {
      return (
        <form onSubmit={submitForm}>
          <p>Submit event would have 3 objects: values, state and props.</p>
          <label>name:*</label>
          <Text field='name' placeholder='type something...' />
          <pre>By default validation performs on <b>blur</b> and <b>submit</b> events</pre>
          <button type='submit'>Submit</button>
          <br />
          <br />
          <strong>Values:</strong>
          <CodeHighlight language='javascript'>
            {() => JSON.stringify(values, null, 2)}
          </CodeHighlight>
        </form>
      )
    }}
  </Form>
)
