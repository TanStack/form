import React, { Component } from 'react'
import PropTypes from 'prop-types'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { connect } from 'react-redux'

import ReducerBuilder from '../redux/ReducerBuilder'
import * as actions from '../redux/actions'

import Utils from '../utils'

/* ----- Recursive Check to see if form is valid  -----*/

const isNotValid = errors => {
  if (Array.isArray(errors)) {
    return errors.some(k => isNotValid(k))
  } else if (errors !== null && typeof errors === 'object') {
    return Object.keys(errors).some(k => isNotValid(errors[k]))
  }
  return errors
}

/* ---------- Helper Methods ----------*/
const newState = state => JSON.parse(JSON.stringify(state))

/* ---------- Form Component ----------*/

class Form extends Component {

  constructor (props) {
    super(props)
    this.asyncValidators = []
    // Unfortunately, babel has some stupid bug with auto-binding async arrow functions
    // So we still need to manually bind them here
    // https://github.com/gaearon/react-hot-loader/issues/391
    this.finishSubmission = this.finishSubmission.bind(this)
    this.setAllValues = this.setAllValues.bind(this)
    this.setAllTouched = this.setAllTouched.bind(this)
    this.callAsynchronousValidators = this.callAsynchronousValidators.bind(this)
  }

  getChildContext () {
    return {
      formApi: this.api,
      formState: this.getFormState()
    }
  }

  componentWillMount () {
    if (this.props.getApi) {
      this.props.getApi(this.api)
    }
  }

  componentDidMount () {
    if (this.props.validateOnMount) {
      // PreValidat
      this.props.dispatch(actions.preValidate())
      // Validate
      this.props.dispatch(actions.validate())
    }
  }

  componentWillReceiveProps (nextProps) {
    const didUpdate = !Utils.isDeepEqual(nextProps.formState, this.props.formState)
    // Call onChange function if it exists
    if (this.props.onChange && didUpdate) {
      this.props.onChange(newState(nextProps.formState))
    }
  }

  get api () {
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
      clearAll: this.clearAll,
      addValue: this.addValue,
      removeValue: this.removeValue,
      setAllValues: this.setAllValues,
      setAllTouched: this.setAllTouched,
      swapValues: this.swapValues
    }
  }

  getFormState () {
    return newState(this.props.formState)
  }

  setValue = (field, value) => {
    this.props.dispatch(actions.setValue(field, value))
    this.props.dispatch(actions.removeAsyncError(field))
    this.props.dispatch(actions.removeAsyncWarning(field))
    this.props.dispatch(actions.removeAsyncSuccess(field))
    if (!this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
    }
  }

  setTouched = (field, touch = true, validate = true) => {
    this.props.dispatch(actions.setTouched(field, touch))
    // We have a flag to perform async validate when touched
    if (validate && !this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
      this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators))
    }
  }

  async setAllTouched (touched) {
    this.props.dispatch(actions.setAllTouched(touched))
    if (!this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
      // Build up list of async functions that need to be called
      const validators = this.props.asyncValidators
        ? Object.keys(this.props.asyncValidators).map(field =>
          this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators))
        )
        : []
      await Promise.all(validators)
    }
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

  async setAllValues (values) {
    this.props.dispatch(actions.setAllValues(values))
    if (!this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
      // Build up list of async functions that need to be called
      const validators = this.props.asyncValidators
        ? Object.keys(this.props.asyncValidators).map(field =>
          this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators))
        )
        : []
      await Promise.all(validators)
    }
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
    this.props.dispatch(actions.removeAsyncError(field))
    this.props.dispatch(actions.removeAsyncWarning(field))
    this.props.dispatch(actions.removeAsyncSuccess(field))
    if (this.props.validateOnMount && !this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
    }
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
    this.props.dispatch(actions.removeAsyncError(field))
    this.props.dispatch(actions.removeAsyncWarning(field))
    this.props.dispatch(actions.removeAsyncSuccess(field))
    if (this.props.validateOnMount && !this.props.validateOnSubmit) {
      this.props.dispatch(actions.preValidate())
      this.props.dispatch(actions.validate())
    }
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

  registerAsyncValidation = func => {
    this.asyncValidators.push(func)
  }

  format = (field, format) => {
    this.props.dispatch(actions.format(field, format))
    this.props.dispatch(actions.preValidate())
    this.props.dispatch(actions.validate())
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

  // This is an internal method used by nested forms to tell the parent that its validating
  validatingField = field => {
    this.props.dispatch(actions.validatingField(field))
  }

  // This is an internal method used by nested forms to tell the parent that its done validating
  doneValidatingField = field => {
    this.props.dispatch(actions.doneValidatingField(field))
  }

  submitForm = e => {
    // Let the user know we are submitting
    this.props.dispatch(actions.submitting(true))
    // PreValidate
    this.props.dispatch(actions.preValidate())
    // Validate
    this.props.dispatch(actions.validate())
    // update submits
    this.props.dispatch(actions.submits())
    // prevent default
    e.preventDefault(e)
    // finish submission process
    this.finishSubmission(e)
  }

  async finishSubmission (e) {
    // Call asynchronous validators
    try {
      await this.callAsynchronousValidators()
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
    const invalid = isNotValid(errors)
    const asyncInvalid = isNotValid(asyncErrors)
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

  async callAsynchronousValidators () {
    // Build up list of async functions that need to be called
    let validators = this.props.asyncValidators
      ? Object.keys(this.props.asyncValidators).map(field =>
        this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators))
      )
      : []
    const childValidators = this.asyncValidators
      ? this.asyncValidators.map(validator =>
        // This looks strange but you call an async function to generate a promise
        validator()
      )
      : []
    // Add all other subscribed validators to the validators list
    validators = validators.concat(childValidators)
    // Call all async validators
    await Promise.all(validators)
  }

  render () {
    const { children, component, render } = this.props

    const formApi = this.api
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
      validateError,
      validateWarning,
      validateSuccess,
      preValidate,
      defaultValues
    } = props

    this.store = createStore(
      ReducerBuilder.build({
        validateError,
        validateWarning,
        validateSuccess,
        preValidate,
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
