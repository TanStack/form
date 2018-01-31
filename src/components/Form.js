import React, { Component } from 'react'
import PropTypes from 'prop-types'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { connect } from 'react-redux'

import ReducerBuilder from '../redux/ReducerBuilder'
import * as actions from '../redux/actions'
import Utils from '../utils'

/* ---------------------------- Helper Methods ----------------------------- */

/* ----- Recursive Check to see if form is valid  ----- */

const isInvalid = errors => {
  if (Array.isArray(errors)) {
    return errors.some(k => isInvalid(k))
  } else if (errors !== null && typeof errors === 'object') {
    return Object.keys(errors).some(k => isInvalid(errors[k]))
  }
  return errors
}

/* -------------- Generates a new state ------------- */

const newState = state => JSON.parse(JSON.stringify(state))

/* ----------------- Form Component ---------------- */

class Form extends Component {

  constructor (props) {
    super(props)
    this.fields = new Map()
    // Unfortunately, babel has some stupid bug with auto-binding async arrow functions
    // So we still need to manually bind them here
    // https://github.com/gaearon/react-hot-loader/issues/391
    this.finishSubmission = this.finishSubmission.bind(this)
    this.asyncValidateAll = this.asyncValidateAll.bind(this)
  }

  getChildContext () {
    return {
      formApi: this.getFormApi(),
      formState: this.getFormState()
    }
  }

  componentWillMount () {
    if (this.props.getApi) {
      this.props.getApi(this.getFormApi())
    }
  }

  componentDidMount () {
    if (this.props.validateOnMount) {
      this.preValidate()
      this.validate()
    }
  }

  componentWillReceiveProps (nextProps) {
    const didUpdate = !Utils.isDeepEqual(nextProps.formState, this.props.formState)
    if (this.props.onChange && didUpdate) {
      this.props.onChange(newState(nextProps.formState))
    }
  }

  getFormApi () {
    return {
      submitForm: this.submitForm,
      setValue: this.setValue,
      getValue: this.getValue,
      setTouched: this.setTouched,
      getTouched: this.getTouched,
      getWarning: this.getWarning,
      getError: this.getError,
      getSuccess: this.getSuccess,
      getFormState: this.getFormState,
      setFormState: this.setFormState,
      setError: this.setError,
      setWarning: this.setWarning,
      setSuccess: this.setSuccess,
      resetAll: this.resetAll,
      reset: this.reset,
      clearAll: this.clearAll,
      addValue: this.addValue,
      removeValue: this.removeValue,
      setAllValues: this.setAllValues,
      setAllTouched: this.setAllTouched,
      swapValues: this.swapValues,
      register: this.register,
      asyncValidate: this.asyncValidate
    }
  }

  getFormState () {
    return newState(this.props.formState)
  }

  setValue = (field, value) => {
    this.props.dispatch(actions.setValue(field, value))
  }

  setTouched = (field, touch = true) => {
    this.props.dispatch(actions.setTouched(field, touch))
  }

  setError = (field, error) => {
    this.props.dispatch(actions.setError(field, error))
  }

  setWarning = (field, warning) => {
    this.props.dispatch(actions.setWarning(field, warning))
  }

  setSuccess = (field, success) => {
    this.props.dispatch(actions.setSuccess(field, success))
  }

  asyncValidate = (field, validate) => {
    this.props.dispatch(actions.asyncValidate(field, validate))
  }

  setAllTouched = () => {
    this.fields.forEach(([name]) => {
      this.setTouched(name, true)
    })
  }

  setAllValues = values => this.props.dispatch(actions.setAllValues(values))

  async asyncValidateAll () {
    // Build up list of async functions that need to be called
    const validators = [...this.fields].reduce((acc, [, field]) => {
      if (field.asyncValidate) {
        return acc.push(field.asyncValidate())
      }
      return acc
    }, [])
    await Promise.all(validators)
  }

  validateAll = () => {
    this.fields.forEach(([name, field]) => {
      if (field.validate) {
        const result = field.validate()
        if (result.error) {
          this.setError(name, result.error)
        }
        if (result.warning) {
          this.setWarning(name, result.warning)
        }
        if (result.success) {
          this.setSuccess(name, result.success)
        }
      }
    })
  }

  preValidateAll = () => {
    this.fields.forEach(([name, field]) => {
      if (field.preValidate) {
        const result = field.preValidate()
        this.setValue(name, result)
      }
    })
  }

  setFormState = formState => {
    this.props.dispatch(actions.setFormState(formState))
  }

  getTouched = field => Utils.get(this.props.formState.touched, field)

  getValue = field => Utils.get(this.props.formState.values, field)

  getError = field => Utils.get(this.props.formState.errors, field)

  getWarning = field => Utils.get(this.props.formState.warnings, field)

  getSuccess = field => Utils.get(this.props.formState.successes, field)

  addValue = (field, value) => {
    this.props.dispatch(
      actions.setValue(field, [...(Utils.get(this.props.formState.values, field) || []), value])
    )
  }

  removeValue = (field, index) => {
    const fieldValue = Utils.get(this.props.formState.values, field) || []
    this.props.dispatch(
      actions.setValue(field, [...fieldValue.slice(0, index), ...fieldValue.slice(index + 1)])
    )
    const fieldTouched = Utils.get(this.props.formState.touched, field) || []
    this.props.dispatch(
      actions.setTouched(field, [...fieldTouched.slice(0, index), ...fieldTouched.slice(index + 1)])
    )
  }

  swapValues = (field, index, destIndex) => {
    const min = Math.min(index, destIndex)
    const max = Math.max(index, destIndex)

    const fieldValues = Utils.get(this.props.formState.values, field) || []

    this.props.dispatch(
      actions.setValue(field, [
        ...fieldValues.slice(0, min),
        fieldValues[max],
        ...fieldValues.slice(min + 1, max),
        fieldValues[min],
        ...fieldValues.slice(max + 1)
      ])
    )
  }

  register = (name, field) => {
    this.fields.set(name, field)
  }

  deregister = name => {
    this.fields.delete(name)
  }

  format = (field, format) => {
    this.props.dispatch(actions.format(field, format))
  }

  reset = field => {
    this.props.dispatch(actions.reset(field))
  }

  resetAll = () => {
    this.props.dispatch(actions.resetAll())
  }

  clearAll = () => {
    this.props.dispatch(actions.clearAll())
  }

  submitForm = e => {
    this.props.dispatch(actions.submitting(true))
    this.setAllTouched()
    this.preValidateAll()
    this.validateAll()
    e.preventDefault(e)
    this.finishSubmission(e)
  }

  async finishSubmission (e) {
    // Call asynchronous validators
    try {
      await this.asyncValidateAll()
    } catch (err) {
      // Let the user know we are done submitting
      this.props.dispatch(actions.submitting(false))
      throw err
    }
    // Pull off errors from form state
    const {
      errors,
      asyncErrors
    } = this.props.formState
    // Only submit if we have no errors
    const invalid = isInvalid(errors)
    const asyncInvalid = isInvalid(asyncErrors)
    // Call on validation fail if we are invalid
    if ((invalid || asyncInvalid) && this.props.onSubmitFailure) {
      this.props.onSubmitFailure(errors)
    }
    // Only update submitted if we are not invalid
    // And there are no active asynchronous validations
    if (!(invalid || asyncInvalid) && this.props.formState.asyncValidations === 0) {
      let values = JSON.parse(JSON.stringify(this.props.formState.values))
      // Call pre submit
      if (this.props.preSubmit) {
        values = this.props.preSubmit(values)
      }
      // Update submitted
      this.props.dispatch(actions.submitted())
      // If onSubmit was passed then call it
      if (this.props.onSubmit) {
        try {
          await this.props.onSubmit(values)
        } catch (error) {
          this.props.onSubmitFailure({}, error)
        }
      }
    }
    // Let the user know we are done submitting
    this.props.dispatch(actions.submitting(false))
  }

  render () {
    const { children, component, render } = this.props

    const formApi = this.getFormApi()
    const formState = this.getFormState()

    const inlineProps = {
      ...formApi,
      ...formState
    }

    const componentProps = {
      formApi,
      formState
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

Form.childContextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object
}

/* ---------- Container ---------- */

const mapStateToProps = state => ({
  formState: state
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

const FormContainer = connect(mapStateToProps, mapDispatchToProps)(Form)

/* ---------- Exports ---------- */
class ReactForm extends Component {
  constructor (props) {
    super(props)

    const {
      defaultValues
    } = props

    this.store = createStore(
      ReducerBuilder.build({
        defaultValues
      }),
      applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
        // createLogger() // neat middleware that logs actions
      )
    )
  }

  render () {
    const { children, ...rest } = this.props

    return (
      <FormContainer store={this.store} {...rest}>
        {children}
      </FormContainer>
    )
  }
}

export default ReactForm
