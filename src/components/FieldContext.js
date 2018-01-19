import React from 'react'
import PropTypes from 'prop-types'

//

import FormApi from './FormApi'

class FieldContext extends React.Component {
  getChildContext () {
    return {
      formApi: this.formApi
    }
  }

  componentWillMount () {
    this.buildApi(this.props)
    this.setDefaults(this.props)
  }

  componentWillReceiveProps (next) {
    if (next.field !== this.props.field) {
      this.buildApi(next)
      this.setDefaults(this.props)
    }
  }

  buildApi = props => {
    // Here we will proxy the calls to the formApi to reflect the new field context
    const { formApi } = this.context
    const { field } = props

    const proxyWithField = (method, field) => (subField, ...rest) =>
      method([field, subField], ...rest)

    const proxiedApiMethods = {
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
      reset: proxyWithField(formApi.rese, field)
    }

    this.formApi = {
      ...formApi,
      ...proxiedApiMethods
    }
  }

  setDefaults = props => {
    if (!props.defaultValue) {
      return
    }
    const currentValue = this.formApi.getValue()
    if (currentValue) {
      return
    }
    this.formApi.setValue(props.defaultValue)
  }

  render () {
    return <FormApi {...this.props} />
  }
}

FieldContext.contextTypes = {
  formApi: PropTypes.object
}

FieldContext.childContextTypes = {
  formApi: PropTypes.object
}

export default FieldContext
