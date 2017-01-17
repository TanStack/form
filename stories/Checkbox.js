import React from 'react'
//
import CodeHighlight from './components/codeHighlight.js'
import { Form, Checkbox } from '../src/index'

export default () => (
  <Form
    defaultValues={{
      subscribe: true,
      adult: false
    }}
  >
    {({submitForm, values}) => {
      return (
        <form onSubmit={submitForm}>
          <p>Submit event would have 3 objects: values, state and props.</p>
          <br />
          <div>
            <label>
              <Checkbox
                field='subscribe'
              />
              <span>subscribe to newsletter <pre>[default is true]</pre></span>
            </label>
          </div>
          <div>
            <label>
              <Checkbox
                field='adult'
              />
              <span>I am over 18 years old <pre>[default is false]</pre></span>
            </label>
          </div>
          <div>
            <label>
              <Checkbox
                field='ads'
              />
              <span>subscribe to advertisements <pre>[no default value is set]</pre></span>
            </label>
          </div>
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
