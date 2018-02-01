import React from 'react'
import PropTypes from 'prop-types'

//

class NestedField extends React.Component {

  getChildContext () {
    return {
      formApi: this.proxiedFormApiMethods,
      formState: this.context.formState
    }
  }

  componentWillMount () {
    this.buildApi(this.props)
  }

  componentWillReceiveProps (next) {
    if (next.field !== this.props.field) {
      this.buildApi(next)
    }
  }

  buildApi = props => {
    // Here we will proxy the calls to the formApi to reflect the new field context
    const { formApi } = this.context
    const { field } = props

    const proxyWithField = (method, field) => (subField, ...rest) =>
      method([field, subField].filter(d => d), ...rest)

    this.proxiedFormApiMethods = {
      getValue: proxyWithField(formApi.getValue, field),
      getTouched: proxyWithField(formApi.getTouched, field),
      getError: proxyWithField(formApi.getError, field),
      getWarning: proxyWithField(formApi.getWarning, field),
      getSuccess: proxyWithField(formApi.getSuccess, field),
      setValue: proxyWithField(formApi.setValue, field),
      setTouched: proxyWithField(formApi.setTouched, field),
      setError: proxyWithField(formApi.setError, field),
      setWarning: proxyWithField(formApi.setWarning, field),
      setSuccess: proxyWithField(formApi.setSuccess, field),
      addValue: proxyWithField(formApi.addValue, field),
      removeValue: proxyWithField(formApi.removeValue, field),
      swapValues: proxyWithField(formApi.swapValues, field),
      validatingField: proxyWithField(formApi.validatingField, field),
      doneValidatingField: proxyWithField(formApi.doneValidatingField, field),
      reset: proxyWithField(formApi.reset, field),
      validate: proxyWithField(formApi.validate, field),
      preValidate: proxyWithField(formApi.preValidate, field),
      asyncValidate: proxyWithField(formApi.asyncValidate, field),
      register: proxyWithField(formApi.register, field),
      deregister: proxyWithField(formApi.deregister, field)
    }
  }

  getFormApi = () => {
    const api = this.proxiedFormApiMethods
    return {
      ...api,
      values: api.getValue()
    }
  }

  render () {
    const { render, component, children, ...rest } = this.props

    if (component) {
      return React.createElement(component, rest, children)
    }
    if (render) {
      return render(rest)
    }
    if (typeof children === 'function') {
      return children(rest)
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
