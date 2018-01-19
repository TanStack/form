import React from 'react'
import PropTypes from 'prop-types'

//

class Field extends React.Component {
  render () {
    const { render, component, children, ...rest } = this.props

    const inlineProps = {
      ...this.context.formApi,
      ...rest
    }

    const componentProps = {
      formApi: this.context.formApi,
      ...rest
    }

    if (component) {
      return React.createElement(component, componentProps, children)
    }
    if (render) {
      return render(inlineProps)
    }
    if (typeof children === 'function') {
      return children(inlineProps)
    }
    return children
  }
}

Field.contextTypes = {
  formApi: PropTypes.object
}

export default Field
