import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'

class Field extends React.Component {
  componentWillMount () {
    this.buildApi(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // If the field name or any validators change, we need to rebuild the api
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

  // Optimization to only rerender if nessisary
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    // Grab needed values
    const field = this.props.field
    const currentFormState = this.context.formState
    const nextFormState = nextContext.formState
    const pure = nextProps.pure

    // When pure, we need to check props and form state to determine if we
    // should update. Otherwise, update all the time.
    if (!pure) {
      return true
    }
    // check child props for changes so we know to re-render
    const nonChildrenProps = {
      ...this.props,
      children: null // do not compare children, that would be an anti-pattern
    }
    const nextNonChildrenProps = {
      ...nextProps,
      children: null
    }

    const shouldUpdate =
      Utils.get(nextFormState.values, field) !== Utils.get(currentFormState.values, field) ||
      Utils.get(nextFormState.touched, field) !== Utils.get(currentFormState.touched, field) ||
      Utils.get(nextFormState.errors, field) !== Utils.get(currentFormState.errors, field) ||
      Utils.get(nextFormState.warnings, field) !== Utils.get(currentFormState.warnings, field) ||
      Utils.get(nextFormState.successes, field) !== Utils.get(currentFormState.successes, field) ||
      Utils.get(nextFormState.validating, field) !==
        Utils.get(currentFormState.validating, field) ||
      Utils.get(nextFormState.validationFailed, field) !==
        Utils.get(currentFormState.validationFailed, field) ||
      !Utils.isShallowEqual(nextNonChildrenProps, nonChildrenProps) ||
      nextFormState.submits !== currentFormState.submits

    return shouldUpdate || false
  }

  componentWillUnmount () {
    this.context.formApi.deregister(this.props.field)
  }

  buildApi = props => {
    // This binds all of the functions less often, and also won't trigger
    // changes when spreading the fieldApi as shallow props
    const { formApi } = this.context
    const { field } = props

    const fullFieldName = formApi.getFullField(field)

    this.fieldApi = {
      setValue: value => formApi.setValue(fullFieldName, value),
      setTouched: touched => formApi.setTouched(fullFieldName, touched),
      setError: error => formApi.setError(fullFieldName, error),
      setWarning: warning => formApi.setWarning(fullFieldName, warning),
      setSuccess: success => formApi.setSuccess(fullFieldName, success),
      addValue: value => formApi.addValue(fullFieldName, value),
      removeValue: index => formApi.addValue(fullFieldName, index),
      swapValues: (...args) => formApi.addValue(fullFieldName, ...args),
      reset: () => formApi.reset(fullFieldName),
      validatingField: () => formApi.validatingField(fullFieldName),
      doneValidatingField: () => formApi.doneValidatingField(fullFieldName),
      validate: opts => formApi.validate(fullFieldName, opts),
      preValidate: opts => formApi.preValidate(fullFieldName, opts),
      asyncValidate: opts => formApi.asyncValidate(fullFieldName, opts),
      validateAll: opts => {
        this.fieldApi.preValidate(opts)
        this.fieldApi.validate(opts)
        return this.fieldApi.asyncValidate(opts)
      }
    }

    this.field = {
      field: fullFieldName,
      getProps: () => this.props,
      api: this.fieldApi,
      children: {}
    }

    this.context.formApi.register(field, this.field)

    this.getFieldValues = () => ({
      fieldName: fullFieldName,
      value: formApi.getValue(fullFieldName),
      touched: formApi.getTouched(fullFieldName),
      error: formApi.getError(fullFieldName),
      warning: formApi.getWarning(fullFieldName),
      success: formApi.getSuccess(fullFieldName)
    })
  }

  render () {
    const {
      field,
      pure,
      render,
      component,
      children,
      validate,
      asyncValidate,
      ...rest
    } = this.props

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

Field.contextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object
}

export default Field
