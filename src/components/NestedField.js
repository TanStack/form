import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'

//

class NestedField extends React.Component {
  constructor (props) {
    super(props)
    this.node = {
      children: []
    }
  }

  getChildContext () {
    return {
      // Any children are now within the context of this nestedField
      formApi: this.fieldApi,
      formState: this.context.formState,
      privateFormApi: this.context.privateFormApi
    }
  }

  componentWillMount () {
    const { defaultValue } = this.props
    this.buildApi(this.props)
    if (defaultValue) {
      this.fieldApi.setValue(defaultValue)
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the field or validators change, we have to rebuild
    if (
      !Utils.isShallowEqual(this.props, nextProps, [
        'field',
        'preValidate',
        'validate',
        'asyncValidate'
      ])
    ) {
      // If the field is changing, we need to deregister it
      if (this.props.field !== nextProps.field) {
        this.context.formApi.deregister(this.node)
      }
      // Rebuild the api, including the field registration
      this.buildApi(nextProps)
    }
  }

  componentWillUnmount () {
    this.context.formApi.deregister(this.node)
  }

  buildApi = props => {
    const { formApi } = this.context
    const { field } = props

    const fullField = formApi.getFullField(field)

    this.fieldApi = {
      // Mark this node as a nested field
      nestedField: true,
      // Spread the current form api
      ...this.context.formApi,
      // Override register function to push to this fields node
      register: node => {
        // TODO: Sometimes, node.field is using deep notation
        // We need to make sure the node tree uses individual fields at each
        // step, and not complex field names, else all hell breaks loose
        const target = this.node
        // You'll probaby want to get the array representation like this:
        // const fieldPath = Utils.makePathArray(node.field)

        target.children[node.field] = {
          ...node,
          parent: target
        }
      },
      // Override deregister function to remove from this fields node
      deregister: node => {
        delete this.node.children[node.field]
      },
      // Override the getFullField to reflect the new field context
      getFullField: field => [fullField, field]
    }

    // Build our node
    this.node = {
      ...this.node,
      field,
      fullField,
      api: this.fieldApi
    }

    // We need to register our node after building the API
    this.context.formApi.register(this.node)
  }

  render () {
    const { render, component, children, ...rest } = this.props

    const inlineProps = {
      ...rest,
      ...this.fieldApi
    }

    const componentProps = {
      ...rest,
      fieldApi: this.fieldApi
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

NestedField.contextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object,
  privateFormApi: PropTypes.object
}

NestedField.childContextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object,
  privateFormApi: PropTypes.object
}

export default NestedField
