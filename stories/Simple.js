import React from 'react'
import { storiesOf } from '@kadira/storybook'
import ReactFormWrapper from './ReactFormWrapper'
import SimpleText from './SimpleText'
import SimpleCheckbox from './SimpleCheckbox'
import SimpleSelect from './SimpleSelect'
import { withKnobs, text } from '@kadira/storybook-addon-knobs'

storiesOf('Simple Form', module)
  .addDecorator(withKnobs)
  .add('with a single text field', () => (
    <ReactFormWrapper wrappedForm={SimpleText} />
  ))

  .add('with checkbox and default values', () => (
    <ReactFormWrapper wrappedForm={SimpleCheckbox} />
  ))

  .add('with select and default values', () => {
    const values = { weekday: text('week:', 'fri') }
    return (
      <ReactFormWrapper wrappedForm={SimpleSelect} default_values={values} />
    )
  })
