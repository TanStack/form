import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'

//

class NestedField extends React.Component {
  getChildContext () {
    return {
      formApi: this.formApi,
      formState: this.context.formState
    }
  }

  componentWillMount () {
    const { defaultValue } = this.props
    this.fields = {}
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
        this.context.formApi.deregister(this.props.field)
      }
      // Rebuild the api, including the field registration
      this.buildApi(nextProps)
    }
  }

  componentWillUnmount () {
    this.context.formApi.deregister(this.props.field)
  }

  buildApi = props => {
    // Here we will prefix the calls to the formApi to reflect the new field context
    const { formApi } = this.context
    const { field } = props

    const fullFieldName = formApi.getFullField(field)

    this.fieldApi = {
      nestedField: true,
      setValue: value => formApi.setValue(fullFieldName, value),
      validate: opts => formApi.validate(fullFieldName, opts),
      preValidate: opts => formApi.preValidate(fullFieldName, opts),
      asyncValidate: opts => formApi.asyncValidate(fullFieldName, opts),
      validateAll: opts => {
        this.fieldApi.preValidate(opts)
        this.fieldApi.validate(opts)
        // TODO debounce this with `this.props.debounce`
        this.fieldApi.asyncValidate(opts)
      }
    }

    this.field = {
      field: fullFieldName,
      getProps: () => this.props,
      api: this.fieldApi,
      children: this.fields
    }

    this.context.formApi.register(field, this.field)

    this.formApi = {
      ...this.context.formApi,
      getFullField: d => [fullFieldName, d],
      register: (name, childField) => {
        this.fields[name] = {
          ...childField,
          parent: this.field
        }
      },
      deregister: childField => {
        delete this.fields[childField]
      }
    }
  }

  render () {
    const { render, component, children, ...rest } = this.props

    const finalProps = {
      ...rest,
      ...this.fieldApi
    }

    if (component) {
      return React.createElement(
        component,
        {
          fieldApi: this.fieldApi,
          ...rest
        },
        children
      )
    }
    if (render) {
      return render(finalProps)
    }
    if (typeof children === 'function') {
      return children(finalProps)
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
