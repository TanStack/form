import React from 'react'
import PropTypes from 'prop-types'

//

class FormApi extends React.Component {
  render () {
    const { render, component, children, ...rest } = this.props

    const inlineProps = {
      ...this.context.formApi,
      ...this.context.formState,
      ...rest
    }

    const componentProps = {
      formApi: {
        ...this.context.formApi,
        ...this.context.formState,
      },
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

FormApi.contextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object
}

export default FormApi
