import React from 'react'
import { storiesOf } from '@kadira/storybook'
import ReactFormWrapper from './ReactFormWrapper'
import DemoForm from './DemoForm'

storiesOf('Demo Form', module)
  .add('mixed fields', () => (
    <ReactFormWrapper wrappedForm={DemoForm} />
  ))
