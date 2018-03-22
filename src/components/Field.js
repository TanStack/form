import React from 'react'
import PropTypes from 'prop-types'

import Utils from '../utils'

class Field extends React.Component {
  componentWillMount () {
    const { defaultValue } = this.props
    this.buildApi(this.props)

    if (typeof defaultValue !== 'undefined' && typeof this.getFieldValues().value === 'undefined') {
      this.fieldApi.setValue(defaultValue)
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the field name or any validators change, we need to rebuild the api
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

  // Optimization to only rerender if nessisary
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    // Grab needed values
    const field = nextContext.formApi.getFullField(this.props.field)
    const currentFormState = this.context.formState
    const nextFormState = nextContext.formState
    const pure = nextProps.pure && nextContext.formProps.pure

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
    this.context.formApi.deregister(this.node)
  }

  buildApi = props => {
    // This binds all of the functions less often, and also won't trigger
    // changes when spreading the fieldApi as shallow props
    const { formApi } = this.context
    const { field } = props

    // Get the full field name
    const fullField = formApi.getFullField(field)

    // Wrap the formApi methods to reflect the new field context
    this.fieldApi = {
      setValue: value => formApi.setValue(fullField, value),
      setTouched: touched => formApi.setTouched(fullField, touched),
      setError: error => formApi.setError(fullField, error),
      setWarning: warning => formApi.setWarning(fullField, warning),
      setSuccess: success => formApi.setSuccess(fullField, success),
      addValue: (subField, value) => formApi.addValue([fullField, subField].filter(Boolean), value),
      removeValue: (subField, index) =>
        formApi.addValue([fullField, subField].filter(Boolean), index),
      swapValues: (subField, ...args) =>
        formApi.addValue([fullField, subField].filter(Boolean), ...args),
      reset: () => formApi.reset(fullField),
      validatingField: () => formApi.validatingField(fullField),
      doneValidatingField: () => formApi.doneValidatingField(fullField),
      validate: opts => formApi.validate(fullField, opts),
      preValidate: opts => formApi.preValidate(fullField, opts),
      asyncValidate: opts => formApi.asyncValidate(fullField, opts),
    }

    // define function to generate field values
    this.getFieldValues = () => ({
      fieldName: fullField,
      value: formApi.getValue(fullField),
      touched: formApi.getTouched(fullField),
      error: formApi.getError(fullField),
      warning: formApi.getWarning(fullField),
      success: formApi.getSuccess(fullField),
    })

    // Define the leaf node
    this.node = {
      field,
      fullField,
      api: this.fieldApi,
      getState: this.getFieldValues,
      getProps: () => this.props,
    }

    // Register field
    formApi.register(this.node)
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
  formState: PropTypes.object,
  formProps: PropTypes.object
}

Field.propTypes = {
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

Field.defaultProps = {
  pure: true
}

export default Field
