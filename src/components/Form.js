import React, { Component } from 'react'
import PropTypes from 'prop-types'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { connect } from 'react-redux'

import BuildReducer from '../redux/BuildReducer'
import * as actions from '../redux/actions'
import Utils from '../utils'
import Tree, { makeNode } from '../utils/Tree'

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
  constructor (props) {
    super(props)
    this.tree = new Tree({
      nested: true,
      children: {},
      api: {
        ...this.getFormApi(),
        validate: opts => this.validate(undefined, opts),
        preValidate: opts => this.preValidate(undefined, opts),
        asyncValidate: opts => this.asyncValidate(undefined, opts)
      },
      getProps: () => this.props
    })
    this.node = this.tree.root
    this.validationPromiseIDs = new Map()
  }

  getChildContext () {
    return {
      formApi: this.getFormApi(),
      formState: this.getFormState(),
      formProps: this.props
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
      this.props.onChange(newState(nextProps.formState), this.getFormApi())
    }
    if (!Utils.isDeepEqual(nextProps.values, this.props.values)) {
      this.setAllValues(nextProps.values)
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
      getAsyncError: this.getAsyncError,
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
      getFullField: this.getFullField,
      getNodeByField: this.getNodeByField
    }
  }

  // Utils

  getFormState = () => newState(this.props.formState)

  recurseUpFromNode = (field, cb, isAsync) => {
    // Find the node using the field
    const target = this.tree.getNodeByField(field, { closest: true })

    // If there is no target at all, stop
    if (!target) {
      return
    }

    let stopped = false
    const stop = () => {
      stopped = true
    }

    // Define recur function
    const recurse = isAsync
      ? async node => {
        // Call the cb with the node
        await cb(node, stop)
        // If we have parent recur up
        if (!stopped && node.parent) {
          recurse(node.parent)
        }
      }
      : node => {
        // Call the cb with the node
        cb(node, stop)
        // If we have parent recur up
        if (!stopped && node.parent) {
          recurse(node.parent)
        }
      }

    // start recursion from the target
    try {
      return recurse(target)
    } catch (err) {
      throw err
    }
  }

  recurseUpAllNodes = cb => {
    // Define recurse function

    const recurse = async (node, parentStop) => {
      let stopped = false
      const stop = () => {
        stopped = true
      }
      // If we have children recurse down
      if (node.children) {
        await Promise.all(Utils.mapObject(node.children, d => recurse(d, stop)))
      }
      if (stopped) {
        // If stopped, propagate up
        parentStop()
      } else {
        // Call the cb with the node
        await cb(node, parentStop)
      }
    }

    // start recursion from the target
    return recurse(this.node, () => {})
  }

  getFieldProps = field => {
    const node = field ? this.tree.getNodeByField(field) || makeNode() : this.node
    return node.getProps()
  }

  getNodeByField = field => {
    const node = this.tree.getNodeByField(field)
    return node
  }

  // Public Api

  setValue = (field, value) => {
    this.props.dispatch(actions.setValue({ field, value }))
    // Validate up the tree
    this.validateUpFromNode(field)
  }

  setTouched = (field, value = true) => {
    this.props.dispatch(actions.setTouched({ field, value }))
    // Validate up the tree
    this.validateUpFromNode(field)
  }

  setError = (field, value) => {
    this.props.dispatch(actions.setError({ field, value }))
  }

  setWarning = (field, value) => {
    this.props.dispatch(actions.setWarning({ field, value }))
  }

  setSuccess = (field, value) => {
    this.props.dispatch(actions.setSuccess({ field, value }))
  }

  preValidate = (field, opts = {}) => {
    // Get the preValidate prop from the field node
    const { preValidate, validateOnSubmit } = this.getFieldProps(field)
    if (preValidate === Utils.noop || ( !opts.submitting && (this.props.validateOnSubmit || validateOnSubmit))) {
      return
    }
    this.props.dispatch(actions.preValidate({ field, validator: preValidate }))
  }

  validate = (field, opts = {}) => {
    // Get the validate prop from the field node
    const { validate, validateOnSubmit } = this.getFieldProps(field)
    if (validate === Utils.noop || ( !opts.submitting && (this.props.validateOnSubmit || validateOnSubmit))) {
      return
    }
    return this.props.dispatch(actions.validate({ field, validator: validate }))
  }

  asyncValidate = async (field, opts = {}) => {
    // Get the asyncValidate prop from the field node
    const { asyncValidate, validateOnSubmit } = this.getFieldProps(field)
    if (asyncValidate === Utils.noop || ( !opts.submitting && (this.props.validateOnSubmit || validateOnSubmit))) {
      return
    }
    return this.props.dispatch(
      actions.asyncValidate({
        field,
        validator: asyncValidate,
        validationPromiseIDs: this.validationPromiseIDs,
      })
    )
  }

  validateUpFromNode = field => {
    // comboValidate all fields up from the node
    this.recurseUpFromNode(field, node => node.api.preValidate())
    this.recurseUpFromNode(field, (node, stop) => {
      // If a validation causes an error, stop all parent validation
      if (node.api.validate()) {
        stop()
      }
    })
    this.recurseUpFromNode(
      field,
      async (node, stop) => {
        if (await node.api.asyncValidate()) {
          stop()
        }
      },
      true
    )
  }

  setAllValues = (values = {}) =>
    this.props.dispatch(
      actions.setAllValues({
        ...this.props.defaultValues,
        ...values
      })
    )


  setAllTouched = async () => {
    let touched = {}
    // Set touched is unique because we dont want to set touched on nested fields
    // We also dont want to call the internal setTouched because that would
    // Execute validation.
    await this.recurseUpAllNodes(node => {
      if (node.nested) {
        return
      }
      if (node.fullField) {
        touched = Utils.set(touched, node.fullField, true)
      }
    })
    this.props.dispatch(actions.setAllTouched(touched))
  }

  preValidateAll = () => {
    this.recurseUpAllNodes(node => {
      if (node.api.preValidate) {
        node.api.preValidate({ submitting: true })
      }
    })
  }

  validateAll = () =>
    this.recurseUpAllNodes((node, stop) => {
      if (node.api.validate) {
        // Stop all parent validation if error is encountered
        if (node.api.validate({ submitting: true })) {
          stop()
        }
      }
    })

  asyncValidateAll = () =>
    this.recurseUpAllNodes(async (node, stop) => {
      if (node.api.asyncValidate) {
        if (await node.api.asyncValidate({ submitting: true })) {
          stop()
        }
      }
    })

  setFormState = formState => {
    this.props.dispatch(actions.setFormState(formState))
  }

	getTouched = field => Utils.get(this.props.formState.touched, field)

  getValue = field => Utils.get(this.props.formState.values, field)

  getError = field => Utils.get(this.props.formState.errors, field)

  getAsyncError = field => Utils.get(this.props.formState.asyncErrors, field)

  getWarning = field => Utils.get(this.props.formState.warnings, field)

  getSuccess = field => Utils.get(this.props.formState.successes, field)

  getFullField = field => field

  addValue = (field, value) => {
    this.props.dispatch(
      actions.setValue({
        field,
        value: [...(Utils.get(this.props.formState.values, field) || []), value],
      })
    )
  }

  removeValue = (field, index) => {
    [
      { attribute: 'values', action: 'setValue' },
      { attribute: 'touched', action: 'setTouched' },
      { attribute: 'errors', action: 'setError' },
    ].forEach(({ attribute, action }) => {
      const fieldAttribute = Utils.get(this.props.formState[attribute], field) || []
      this.props.dispatch(
        actions[action]({
          field,
          value: [...fieldAttribute.slice(0, index), ...fieldAttribute.slice(index + 1)],
        })
      )
    })
  }

  swapValues = (field, index, destIndex) => {
    const min = Math.min(index, destIndex)
    const max = Math.max(index, destIndex)

    const fieldValues = Utils.get(this.props.formState.values, field) || []

    this.props.dispatch(
      actions.setValue({
        field,
        value: [
          ...fieldValues.slice(0, min),
          fieldValues[max],
          ...fieldValues.slice(min + 1, max),
          fieldValues[min],
          ...fieldValues.slice(max + 1),
        ],
      })
    )
  }

  register = node => this.tree.addNode(node)

  deregister = node => {
    this.tree.removeNode(node)
  }

  reset = field => {
    this.props.dispatch(actions.reset({ field }))
  }

  resetAll = () => {
    this.props.dispatch(actions.resetAll())
  }

  clearAll = () => {
    this.props.dispatch(actions.clearAll())
  }

  preSubmit = async values => {
    const newValues = Utils.clone(values)
    await this.recurseUpAllNodes(node => {
      const { preSubmit } = node.getProps()
      if (preSubmit) {
        Utils.set(newValues, node.fullField, preSubmit(Utils.get(newValues, node.fullField)))
      }
    })
    return newValues
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
      this.props.onSubmitFailure(errors, null, this.getFormApi())
    }
    // Only update submitted if we are not invalid
    // And there are no active asynchronous validations
    if (!(invalid || asyncInvalid) && this.props.formState.asyncValidations === 0) {
      let values = JSON.parse(JSON.stringify(this.props.formState.values))
      // Call pre submit
      values = await this.preSubmit(values)
      // Update submitted
      this.props.dispatch(actions.submitted())
      // If onSubmit was passed then call it
      if (this.props.onSubmit) {
        try {
          await this.props.onSubmit(values, e, this.getFormApi())
        } catch (error) {
          if (this.props.onSubmitFailure) {
            this.props.onSubmitFailure({}, error, this.getFormApi())
          } else {
            throw error
          }
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
      formApi: {
        ...formApi,
        ...formState
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

Form.childContextTypes = {
  formApi: PropTypes.object,
  formState: PropTypes.object,
  formProps: PropTypes.object
}

Form.defaultProps = {
  pure: true,
  preventDefault: true,
  defaultValues: {}
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

    const { defaultValues, values } = props

    this.store = createStore(
      BuildReducer({
        defaultValues,
        values
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
