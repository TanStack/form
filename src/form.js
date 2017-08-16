import React from 'react'
import PropTypes from 'prop-types'
import _ from './utils'

const noop = () => {}
const reop = d => d

export const FormDefaultProps = {
  loadState: noop,
  defaultValues: {},
  preValidate: reop,
  validate: () => null,
  onValidationFail: noop,
  onChange: noop,
  saveState: noop,
  willUnmount: noop,
  preSubmit: reop,
  onSubmit: noop,
  postSubmit: noop,
}

class Form extends React.Component {
  static defaultProps = FormDefaultProps
  static childContextTypes = { formAPI: PropTypes.object }
  constructor (props) {
    super(props)

    this.setAllValues = this.setAllValues.bind(this)
    this.setValue = this.setValue.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setNestedError = this.setNestedError.bind(this)
    this.getError = this.getError.bind(this)
    this.setTouched = this.setTouched.bind(this)
    this.getTouched = this.getTouched.bind(this)
    this.addValue = this.addValue.bind(this)
    this.removeValue = this.removeValue.bind(this)
    this.swapValues = this.swapValues.bind(this)
    this.setAllTouched = this.setAllTouched.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.getDefaultState = this.getDefaultState.bind(this) // using 'Default' since `Initial` will now throw deprecation warnings

    this.state = this.getDefaultState()
  }

  getDefaultState () {
    const { defaultValues, values, loadState } = this.props

    const mergedValues = {
      ...defaultValues,
      ...values,
    }

    return (
      loadState(this.props, this) || {
        values: _.clone(mergedValues),
        touched: {},
        errors: {},
        nestedErrors: {},
      }
    )
  }

  getChildContext () {
    return {
      formAPI: this.getAPI(),
    }
  }

  componentWillMount () {
    this.emitChange(this.state, true)
  }

  componentWillReceiveProps (props) {
    const { defaultValues, values } = props
    if (
      this.props.defaultValues === defaultValues &&
      this.props.values === values
    ) {
      return
    }

    const mergedValues =
      this.props.defaultValues === defaultValues
        ? values
        : { ...defaultValues, ...values }

    this.setFormState(
      {
        values: mergedValues ? _.clone(mergedValues) : {},
      },
      true
    )
  }

  componentWillUmount () {
    this.props.willUnmount(this.state, this.props, this)
  }

  // API
  setAllValues (values, noTouch) {
    if (noTouch) {
      return this.setFormState({ values })
    }
    this.setFormState({ values, touched: {} })
  }

  setValue (field, value, noTouch) {
    const state = this.state
    const values = _.set(state.values, field, value)
    // Also set touched since the value is changing
    if (noTouch) {
      return this.setFormState({ values })
    }
    const touched = _.set(state.touched, field)
    this.setFormState({ values, touched })
  }

  getValue (field, fallback) {
    const state = this.state
    const val = _.get(state.values, field)
    return typeof val !== 'undefined' ? val : fallback
  }

  setNestedError (field, value = true) {
    const nestedErrors = _.set(this.state.nestedErrors, field, value)
    this.setFormState({ nestedErrors })
  }

  getError (field) {
    return _.get(this.state.errors, field)
  }

  setTouched (field, value = true) {
    const touched = _.set(this.state.touched, field, value)
    this.setFormState({ touched })
  }

  getTouched (field) {
    const state = this.state
    if (this.state.dirty === true || this.props.touched === true) {
      return true
    }
    return _.get(state.touched, field)
  }

  addValue (field, value) {
    const state = this.state
    const values = _.set(state.values, field, [
      ..._.get(state.values, field, []),
      value,
    ])
    this.setFormState({ values })
  }

  removeValue (field, index) {
    const state = this.state
    const fieldValue = _.get(state.values, field, [])
    const values = _.set(state.values, field, [
      ...fieldValue.slice(0, index),
      ...fieldValue.slice(index + 1),
    ])
    this.setFormState({ values })
  }

  swapValues (field, index, destIndex) {
    const state = this.state

    const min = Math.min(index, destIndex)
    const max = Math.max(index, destIndex)

    const fieldValues = _.get(state.values, field, [])
    const values = _.set(state.values, field, [
      ...fieldValues.slice(0, min),
      fieldValues[max],
      ...fieldValues.slice(min + 1, max),
      fieldValues[min],
      ...fieldValues.slice(max + 1),
    ])
    this.setFormState({ values })
  }

  setAllTouched (dirty = true, state) {
    this.setFormState({
      ...state,
      dirty: !!dirty,
    })
  }

  resetForm () {
    return this.setFormState(this.getDefaultState(), true)
  }

  submitForm (e) {
    e && e.preventDefault && e.preventDefault(e)
    const state = this.state
    const errors = this.validate(state.values, state, this.props)
    if (errors) {
      if (!state.dirty) {
        this.setAllTouched(true, { errors })
      }
      return this.props.onValidationFail(state.values, state, this.props, this)
    }
    const preSubmitValues = this.props.preSubmit(
      state.values,
      state,
      this.props,
      this
    )
    this.props.onSubmit(preSubmitValues, state, this.props, this)
    this.props.postSubmit(preSubmitValues, state, this.props, this)
  }

  // Utils
  getAPI () {
    return {
      setAllValues: this.setAllValues,
      setValue: this.setValue,
      getValue: this.getValue,
      setNestedError: this.setNestedError,
      getError: this.getError,
      setTouched: this.setTouched,
      getTouched: this.getTouched,
      addValue: this.addValue,
      removeValue: this.removeValue,
      swapValues: this.swapValues,
      setAllTouched: this.setAllTouched,
      resetForm: this.resetForm,
      submitForm: this.submitForm,
    }
  }

  setFormState (newState, silent) {
    if (newState && newState.values && !newState.errors) {
      newState.values = this.props.preValidate(
        newState.values,
        newState,
        this.props,
        this
      )
      newState.errors = this.validate(newState.values, newState, this.props)
    }
    this.setState(newState, () => {
      this.props.saveState(this.state, this.props, this)
      if (!silent) {
        this.emitChange(this.state, this.props)
      }
    })
  }

  emitChange (state, initial) {
    this.props.onChange(state, this.props, initial, this)
  }

  validate (values, state, props) {
    const errors = this.props.validate(
      removeNestedErrorValues(
        values,
        this.state ? this.state.nestedErrors : {}
      ),
      state,
      props,
      this
    )
    return cleanErrors(errors)
  }

  render () {
    const props = {
      ...this.props,
      ...this.state,
      ...this.getAPI(),
    }
    const { children, ...rest } = props
    const resolvedChild =
      typeof children === 'function' ? children(rest) : children
    return resolvedChild
  }
}

export default Form

// Utils

function cleanErrors (err) {
  if (_.isObject(err)) {
    const resolved = _.mapValues(err, cleanErrors)
    const found = _.pickBy(resolved, d => d)
    return Object.keys(found).length ? resolved : undefined
  }
  if (_.isArray(err)) {
    const resolved = err.map(cleanErrors)
    const found = resolved.find(d => d)
    return found ? resolved : undefined
  }
  return err
}

// removeNestedErrorValues recurses the values object and turns any
// field that has a truthy corresponding nested form error field into undefined.
// This allows properly validating a nested form by detecting that undefined value
// in the validation function
function removeNestedErrorValues (values, nestedErrors) {
  const recurse = (current, path = []) => {
    if (_.isObject(current)) {
      return _.mapValues(current, (d, i) => {
        return recurse(d, [...path, i])
      })
    }
    if (_.isArray(current)) {
      return current.map((d, key) => {
        return recurse(d, [...path, key])
      })
    }
    if (!_.isObject(current) && !_.isArray(current) && current) {
      return _.set(values, path, undefined)
    }
    return current
  }
  recurse(nestedErrors)
  return values
}
