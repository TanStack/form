/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
//
import { Form, Text } from '../../../lib/index'
import CodeHighlight from './components/CodeHighlight'

class Story extends React.Component {
  render() {
    return (
      <Form
        validate={({ name }) => {
          return {
            name: !name ? 'A name is required' : undefined
          }
        }}
      >
        {({ submitForm, values }) => {
          return (
            <form onSubmit={submitForm}>
              <p>Submit event would have 3 objects: values, state and props.</p>
              <label>name:*</label>
              <Text field="name" placeholder="type something..." />
              <pre>
                By default validation performs on
                {' '}
                <b>blur</b>
                {' '}
                and
                {' '}
                <b>submit</b>
                {' '}
                events
              </pre>
              <button type="submit">Submit</button>
              <br />
              <br />
              <strong>Values:</strong>
              <CodeHighlight>
                {JSON.stringify(values, null, 2)}
              </CodeHighlight>
            </form>
          )
        }}
      </Form>
    )
  }
}

// Source Code
const source = require('!raw!./Text')

export default () => (
  <div>
    <Story />
    <strong>Source: </strong><br /><CodeHighlight>{source}</CodeHighlight>
  </div>
)
