import React from 'react'
import PropTypes from 'prop-types'

//

class FieldApi extends React.Component {
  render () {
    const { render, component, children, field, ...rest } = this.props

    const {
      formApi,
    } = this.context

    // Get the full field name
    const fullField = formApi.getFullField(field)

    // Get the node of that field
    const node = formApi.getNodeByField(fullField)

    // Get the field state and api
    const fieldApi = node ? node.api : {}
    const fieldState = node ? node.getState() : {}

    const inlineProps = {
      ...fieldApi,
      ...fieldState,
      ...rest,
    }

    const componentProps = {
      fieldApi: {
        ...fieldApi,
        ...fieldState,
      },
      ...rest,
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

FieldApi.contextTypes = {
  formApi: PropTypes.object,
}

export default FieldApi
