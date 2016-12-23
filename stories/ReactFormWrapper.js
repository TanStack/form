import React from 'react'
import { action } from '@kadira/storybook-addon-actions'

class ReactFormWrapper extends React.Component {

  render () {
    const WrappedForm = this.props.wrappedForm

    return (
      <div className='form_wrapper'>
        <WrappedForm
          onSubmit={action('submitted')}
        />
      </div>
    )
  }
}

export default ReactFormWrapper
