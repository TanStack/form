import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'
import { makeNode } from '../utils/Tree'

//

class NestedField extends React.Component {
  static defaultProps = {
    defaultValues: {}
  }

  getChildContext () {
    return {
      // Any children are now within the context of this nestedField
      formApi: this.formApi,
      formState: this.context.formState
    }
  }

  componentWillMount () {
    this.node = {}
    const { defaultValues } = this.props
    this.buildApi(this.props)

    if (typeof this.fieldApi.getValue() === 'undefined') {
      this.fieldApi.setValue(undefined, defaultValues)
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the field or validators change, we have to rebuild
    if (
      !Utils.isShallowEqual(this.props, nextProps, ['preValidate', 'validate', 'asyncValidate']) ||
      Utils.makePathArray(this.props.field).join('.') !==
        Utils.makePathArray(nextProps.field).join('.')
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

    // Overrides on the form api for child nodes
    this.formApi = {
      // Spread the current form api
      ...formApi,
      // Override the getFullField to reflect the new field context
      getFullField: field => [fullField, field]
    }

    const proxySubField = method => (subField, ...args) =>
      method([fullField, subField].filter(Boolean), ...args)

    // Set up the node's field-level api
    this.fieldApi = {
      // Most of these methods should act just like the form api methods,
      // since a nested field operates on multiple fields, not a single
      // field
      getValue: proxySubField(formApi.getValue),
      setValue: proxySubField(formApi.setValue),
      setTouched: proxySubField(formApi.setTouched),
      setError: proxySubField(formApi.setError),
      setWarning: proxySubField(formApi.setWarning),
      setSuccess: proxySubField(formApi.setSuccess),
      addValue: proxySubField(formApi.addValue),
      removeValue: proxySubField(formApi.removeValue),
      swapValues: proxySubField(formApi.swapValues),
      reset: proxySubField(formApi.reset),
      validatingField: () => formApi.validatingField(fullField),
      doneValidatingField: () => formApi.doneValidatingField(fullField),
      validate: opts => formApi.validate(fullField, opts),
      preValidate: opts => formApi.preValidate(fullField, opts),
      asyncValidate: opts => formApi.asyncValidate(fullField, opts)
    }

    // define function to generate field values
    this.getFieldValues = () => ({
      fieldName: fullField,
      values: formApi.getValue(fullField),
      touched: formApi.getTouched(fullField),
      error: formApi.getError(fullField),
      warning: formApi.getWarning(fullField),
      success: formApi.getSuccess(fullField)
    })

    // Build our node
    this.node = makeNode({
      ...this.node,
      nested: true,
      field,
      fullField,
      api: this.fieldApi,
      getState: this.getFieldValues,
      getProps: () => this.props,
    })

    // We need to register our node after building the API
    formApi.register(this.node)
  }

  render () {
    const { render, component, children, ...rest } = this.props

    const inlineProps = {
      ...rest,
      ...this.fieldApi,
      ...this.getFieldValues()
    }

    const componentProps = {
      ...rest,
      fieldApi: {
        ...this.fieldApi,
        ...this.getFieldValues()
      }
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
  formState: PropTypes.object
}

NestedField.childContextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object
}

export default NestedField
