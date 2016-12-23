import React from 'react'
import { storiesOf } from '@kadira/storybook'
import ReactFormWrapper from './ReactFormWrapper'
import SimpleText from './SimpleText'
import SimpleCheckbox from './SimpleCheckbox'

storiesOf('Simple Form', module)
  .add('with a single text field', () => (
    <ReactFormWrapper wrappedForm={SimpleText} />
  ))

  .add('with checkbox and default values', () => (
    <ReactFormWrapper wrappedForm={SimpleCheckbox} />
  ))
