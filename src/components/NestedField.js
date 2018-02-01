import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'

//

class NestedField extends React.Component {
  getChildContext () {
    return {
      formApi: this.prefixedFormApiMethods,
      formState: this.context.formState
    }
  }

  componentWillMount () {
    const { field, defaultValue } = this.props
    this.fields = []
    this.buildApi(this.props)
    this.context.formApi.register(field, this.fieldApi)
    if (defaultValue) {
      this.fieldApi.setValue(defaultValue)
    }
  }

  componentWillReceiveProps (next) {
    if (next.field !== this.props.field) {
      this.buildApi(next)
    }
  }

  componentWillUnmount () {
    this.context.formApi.deregister(this.props.field)
  }

  buildApi = props => {
    // Here we will prefix the calls to the formApi to reflect the new field context
    const { formApi } = this.context
    const { field, preValidate, validate, asyncValidate } = props

    this.fieldApi = {
      nestedField: true,
      setValue: value => formApi.setValue(field, value),
      validate: validate ? opts => formApi.validate(field, validate, opts) : Utils.noop,
      preValidate: preValidate ? opts => formApi.preValidate(field, preValidate, opts) : Utils.noop,
      asyncValidate: asyncValidate
        ? opts => formApi.asyncValidate(field, asyncValidate, opts)
        : Utils.noop,
      validateAll: immediateAsync => {
        this.fieldApi.preValidate()
        this.fieldApi.validate()
        if (immediateAsync) {
          this.fieldApi.asyncValidate()
        } else {
          // TODO debounce this with `this.props.debounce`
          // this.fieldApi.asyncValidate()
        }
      }
    }

    const prefixWithField = (method, field) => (subField, ...rest) =>
      method([field, subField].filter(d => d), ...rest)

    this.prefixedFormApiMethods = {
      getValue: prefixWithField(formApi.getValue, field),
      getTouched: prefixWithField(formApi.getTouched, field),
      getError: prefixWithField(formApi.getError, field),
      getWarning: prefixWithField(formApi.getWarning, field),
      getSuccess: prefixWithField(formApi.getSuccess, field),
      setValue: prefixWithField(formApi.setValue, field),
      setTouched: prefixWithField(formApi.setTouched, field),
      setError: prefixWithField(formApi.setError, field),
      setWarning: prefixWithField(formApi.setWarning, field),
      setSuccess: prefixWithField(formApi.setSuccess, field),
      addValue: prefixWithField(formApi.addValue, field),
      removeValue: prefixWithField(formApi.removeValue, field),
      swapValues: prefixWithField(formApi.swapValues, field),
      validatingField: prefixWithField(formApi.validatingField, field),
      doneValidatingField: prefixWithField(formApi.doneValidatingField, field),
      reset: prefixWithField(formApi.reset, field),

      preValidate: prefixWithField((prefixedField, childValidate, opts = {}) => {
        if (childValidate) {
          formApi.preValidate(prefixedField, childValidate, opts)
        }

        if (!opts.submitting && preValidate) {
          formApi.preValidate(field, preValidate, opts)
        }
      }, field),

      validate: prefixWithField((prefixedField, childValidate, opts = {}) => {
        if (childValidate) {
          formApi.validate(prefixedField, childValidate, opts)
        }
        if (!opts.submitting) {
          formApi.validate(field, validate, opts)
        }
      }, field),
      asyncValidate: prefixWithField(
        (prefixedField, childValidate, opts = {}) =>
          (async () => {
            if (childValidate) {
              await formApi.asyncValidate(prefixedField, childValidate, opts)
            }
            if (!opts.submitting && asyncValidate) {
              formApi.asyncValidate(field, asyncValidate, opts)
            }
          })(),
        field
      ),

      register: (childField, childFieldApi, childFields) => {
        this.fields.push({
          field: childField,
          fieldApi: childFieldApi,
          childFields
        })
        formApi.register(field, this.fieldApi, this.fields)
      },

      deregister: childField => {
        this.fields = this.fields.filter(d => d.field !== childField)
        formApi.register(field, this.fieldApi, this.fields)
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
