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

// TODO figure out way to make state immutable
const newState = state => JSON.parse(JSON.stringify(state))

/* ----------------- Form Component ---------------- */

class Form extends Component {
  static defaultProps = {
    preventDefault: true
  }

  constructor (props) {
    super(props)
    this.fields = {}
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
      this.preValidateAll()
      this.validateAll()
      this.asyncValidateAll()
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
      deregister: this.deregister,
      asyncValidate: this.asyncValidate,
      validate: this.validate,
      preValidate: this.preValidate,
      getFullField: this.getFullField
    }
  }

  getFormState () {
    return newState(this.props.formState)
  }

  recurseUpAllFields = cb => {
    const recurse = async node => {
      await Promise.all(Object.keys(node.children).map(key => recurse(node.children[key])))
      return cb(node)
    }
    return Promise.all(Object.keys(this.fields).map(key => recurse(this.fields[key])))
  }

  fieldCallback = (field, cb, { bubble = true } = {}) => {
    const recurse = async node => {
      await cb(node)
      if (bubble && node.parent) {
        return recurse(node.parent)
      }
    }
    return recurse(this.getField(field))
  }

  getField = field => Utils.get(this.fields, field, undefined, 'children')

  // Private Field Api

  private_preValidate = (field, opts) => {
    this.fieldCallback(
      field,
      node => {
        const { preValidate } = node.getProps()
        if (preValidate) {
          return this.props.dispatch(actions.preValidate(node.field, preValidate))
        }
      },
      opts
    )
  }

  private_validate = (field, opts) => {
    this.fieldCallback(
      field,
      node => {
        const { validate } = node.getProps()
        if (validate) {
          this.props.dispatch(actions.validate(node.field, validate))
        }
      },
      opts
    )
  }

  private_asyncValidate = async (field, opts) => {
    this.fieldCallback(
      field,
      node => {
        const { asyncValidate } = node.getProps()
        if (asyncValidate) {
          return this.props.dispatch(actions.asyncValidate(node.field, asyncValidate))
        }
      },
      opts
    )
  }

  // Public Field Api

  setValue = (field, value, { validate = true } = {}) => {
    this.props.dispatch(actions.setValue(field, value))
    if (validate && !this.props.validateOnSubmit) {
      this.private_preValidate(field)
      this.private_validate(field)
      // TODO debounce this somehow
      // await this.private_asyncValidate(field)
    }
  }

  setTouched = async (field, touch = true, { validate = true } = {}) => {
    this.props.dispatch(actions.setTouched(field, touch))
    if (validate && !this.props.validateOnSubmit) {
      this.private_preValidate(field)
      this.private_validate(field)
      await this.private_asyncValidate(field)
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

  validateAll = (() => async field => {
    this.preValidate(field)
    this.validate(field)
    await this.asyncValidate(field)
  })()

  preValidate = (field, opts) => this.private_preValidate(field, opts)

  validate = (field, opts) => this.private_validate(field, opts)

  asyncValidate = (field, opts) => this.private_asyncValidate(field, opts)

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

  format = (field, format) => {
    this.props.dispatch(actions.format(field, format))
  }

  reset = field => {
    this.props.dispatch(actions.reset(field))
  }

  // Public Form API

  getFullField = d => d

  setAllTouched = () => {
    this.recurseUpAllFields(node => {
      // Set touched is unique because we dont want to set touched on nested fields
      // We also dont want to call the internal setTouched because that would
      // Execute validation, therefore we need to build the full name in this recursion
      if (node.api.nestedField) {
        return
      }
      this.setTouched(node.field, true, { validate: false })
    })
  }

  setAllValues = values => this.props.dispatch(actions.setAllValues(values))

  preValidateAll = () => {
    this.recurseUpAllFields(node => {
      node.api.preValidate({ bubble: false })
    })
  }

  validateAll = () => {
    this.recurseUpAllFields(node => {
      node.api.validate({ bubble: false })
    })
  }

  asyncValidateAll = () =>
    (async () => {
      this.recurseUpAllFields(node => node.api.asyncValidate({ bubble: false }))
    })()

  setFormState = formState => {
    this.props.dispatch(actions.setFormState(formState))
  }

  register = (name, childField) => {
    const pathArray = Utils.makePathArray(name)
    // set this field as the cursor
    let cursor = {
      children: this.fields
    }
    // for each middle path key, reuse or create a field obj
    pathArray.forEach((key, i) => {
      // create filler field obj
      if (i < pathArray.length - 1) {
        cursor.children[key] = cursor.children[key] || {
          field: [cursor.field, key].filter(d => d),
          getProps: () => ({}),
          api: {
            nestedField: true,
            preValidate: Utils.noop,
            validate: Utils.noop,
            asyncValidate: Utils.noop
          },
          children: {},
          parent: cursor
        }
        cursor = cursor.children[key]
      } else {
        // set the last field as the actual child field
        cursor.children[key] = childField
      }
    })
  }

  deregister = name => {
    const pathArray = Utils.makePathArray(name)
    // set this field as the cursor
    let cursor = { children: this.fields }
    // for each middle path key, reuse or create a field obj
    pathArray.forEach((key, i) => {
      if (i < pathArray.length - 1) {
        cursor = cursor.children[key]
      } else {
        // delete the last field
        delete cursor.children[key]
      }
    })
  }

  resetAll = () => {
    this.props.dispatch(actions.resetAll())
  }

  clearAll = () => {
    this.props.dispatch(actions.clearAll())
  }

  submitForm = async e => {
    this.props.dispatch(actions.submitting(true))
    this.props.dispatch(actions.submits())
    this.setAllTouched()
    this.preValidateAll()
    this.validateAll()

    // We prevent default, by default, unless override is passed
    if (e && e.preventDefault && this.props.preventDefault) {
      e.preventDefault(e)
    }
    // We need to prevent default if override is passed and form is invalid
    if (!this.props.preventDefault) {
      // Pull off errors from form state
      const { errors, asyncErrors } = this.props.formState
      // Check to see if its invalid
      const invalid = isInvalid(errors) || isInvalid(asyncErrors)
      // Prevent default becaues form is invalid
      if (invalid && e && e.preventDefault) {
        e.preventDefault(e)
      }
    }

    // Call asynchronous validators
    try {
      await this.asyncValidateAll()
    } catch (err) {
      // Let the user know we are done submitting
      this.props.dispatch(actions.submitting(false))
      throw err
    }
    // Pull off errors from form state
    const { errors, asyncErrors } = this.props.formState
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
          await this.props.onSubmit(values, e)
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

    const { defaultValues } = props

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
