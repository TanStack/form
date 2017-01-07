import React from 'react'
import Form from '../src/form'
import Checkbox from '../src/formInputs/checkbox'

export default (
  <Form
    defaultValues={{
      subscribe: true,
      adult: false
    }}
  >
    {({submitForm}) => {
      return (
        <form onSubmit={submitForm}>
          <p>Submit event would have 3 objects: values, state and props.</p>
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
        </form>
      )
    }}
  </Form>
)
