import React from 'react'
import PropTypes from 'prop-types'

//

class FormField extends React.Component {
  render () {
    const { render, component, children, ...rest } = this.props

    if (component) {
      return React.createElement(
        component,
        {
          formApi: this.context.formApi,
          ...rest,
        },
        children,
      )
    }
    return (render || children)({ ...this.context.formApi, ...rest })
  }
}

FormField.contextTypes = {
  formApi: PropTypes.object,
}

export default FormField
