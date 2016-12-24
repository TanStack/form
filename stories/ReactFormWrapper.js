import React from 'react'
import { action } from '@kadira/storybook-addon-actions'

class ReactFormWrapper extends React.Component {

  render () {
    const WrappedForm = this.props.wrappedForm
    return (
      <div className='form_wrapper'>
        <WrappedForm
          onSubmit={action('submitted')}
          values={this.props.default_values}
        />
      </div>
    )
  }
}

ReactFormWrapper.propTypes = {
  onSubmit: React.PropTypes.func,
  default_values: React.PropTypes.object
}

export default ReactFormWrapper
