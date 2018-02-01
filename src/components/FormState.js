import React from 'react'
import PropTypes from 'prop-types'

//

class FormState extends React.Component {
  render () {
    const { render, component, children, ...rest } = this.props

    const inlineProps = {
      ...this.context.formState,
      ...rest
    }

    const componentProps = {
      formState: this.context.formState,
      ...rest
    }

    if (component) {
      return React.createElement(component, componentProps, children)
    }
    if (render) {
      return render(inlineProps)
    }
    // There's no reason for form api to simply return it's children, so only
    // support a child function
    return children(inlineProps)
  }
}

FormState.contextTypes = {
  formState: PropTypes.object
}

export default FormState
