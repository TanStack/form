import React from 'react'
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
  postSubmit: noop
}

export default function Form (config = {}) {
  return (Comp) => {
    return React.createClass({
      childContextTypes: {
        formAPI: React.PropTypes.object
      },
      getChildContext () {
        return {
          formAPI: this.getAPI()
        }
      },
      // Lifecycle
      getDefaultProps () {
        return Object.assign({}, FormDefaultProps, config)
      },
      getInitialState () {
        const values = Object.assign({}, _.clone(this.props.defaultValues), _.clone(this.props.values))
        return this.props.loadState(this.props) || {
          values,
          touched: {},
          errors: this.validate(values),
          nestedErrors: {}
        }
      },
      componentWillMount () {
        this.emitChange(this.state, true)
      },
      componentWillReceiveProps (props) {
        if (props.values === this.props.values) {
          return
        }

        this.setFormState({
          values: _.clone(props.values) || {}
        }, true)
      },
      componentWillUnmount () {
        this.props.willUnmount(this.state, this.props)
      },

      // API
      setValue (field, value, noTouch) {
        const state = this.state
        const values = _.set(state.values, field, value)
        // Also set touched since the value is changing
        if (noTouch) {
          return this.setFormState({values})
        }
        const touched = _.set(state.touched, field, value)
        this.setFormState({values, touched})
      },
      getValue (field, fallback) {
        const state = this.state
        const val = _.get(state.values, field)
        return typeof val !== 'undefined' ? val : fallback
      },
      setNestedError (field, value = true) {
        const nestedErrors = _.set(this.state.nestedErrors, field, value)
        this.setFormState({nestedErrors})
      },
      getError (field) {
        return _.get(this.state.errors, field)
      },
      setTouched (field, value = true) {
        const touched = _.set(this.state.touched, field, value)
        this.setFormState({touched})
      },
      getTouched (field) {
        const state = this.state
        if (this.state.dirty === true || this.props.touched === true) {
          return true
        }
        return _.get(state.touched, field)
      },
      addValue (field, value) {
        const state = this.state
        const values = _.set(state.values, field, [
          ..._.get(state.values, field, []),
          value
        ])
        this.setFormState({values})
      },
      removeValue (field, index) {
        const state = this.state
        const fieldValue = _.get(state.values, field, [])
        const values = _.set(state.values, field, [
          ...fieldValue.slice(0, index),
          ...fieldValue.slice(index + 1)
        ])
        this.setFormState({values})
      },
      swapValues (field, index, destIndex) {
        const state = this.state
        const fieldValues = _.get(state.values, field, [])
        const values = _.set(state.values, field, [
          ...fieldValues.slice(0, index),
          fieldValues[destIndex],
          ...fieldValues.slice(index + 1, destIndex),
          fieldValues[index],
          ...fieldValues.slice(destIndex + 1)
        ])
        this.setFormState({values})
      },
      setAllTouched (dirty = true) {
        this.setFormState({dirty: !!dirty})
      },
      submitForm (e) {
        e && e.preventDefault && e.preventDefault(e)
        const state = this.state
        const errors = this.validate(state.values, state, this.props)
        if (errors) {
          if (!state.dirty) {
            this.setAllTouched()
          }
          return this.props.onValidationFail(state, this.props)
        }
        const preSubmitValues = this.props.preSubmit(state.values, state, this.props)
        this.props.onSubmit(preSubmitValues, state, this.props)
        this.props.postSubmit(preSubmitValues, state, this.props)
      },

      // Utils
      getAPI () {
        return {
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
          submitForm: this.submitForm
        }
      },
      setFormState (newState, silent) {
        if (newState && newState.values) {
          newState.values = this.props.preValidate(newState.values, newState, this.props)
          newState.errors = this.validate(newState.values, newState, this.props)
        }
        this.setState(newState, () => {
          this.props.saveState(this.state, this.props)
          if (!silent) {
            this.emitChange(this.state, this.props)
          }
        })
      },
      emitChange (state, initial) {
        this.props.onChange(state, this.props, initial)
      },
      validate (values) {
        const errors = this.props.validate(
          removeNestedErrorValues(values, this.state ? this.state.nestedErrors : {})
        )
        return cleanErrors(errors)
      },
      // Render
      render () {
        const props = {
          ...this.props,
          ...this.state,
          ...this.getAPI()
        }
        return (
          <Comp {...props} />
        )
      }
    })
  }
}

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

function removeNestedErrorValues (value, nestedErrors) {
  const recurse = (value, path = []) => {
    if (_.get(nestedErrors, path)) {
      return undefined
    }
    if (_.isObject(value)) {
      return _.mapValues(value, (d, i) => {
        return recurse(d, [...path, i])
      })
    }
    if (_.isArray(value)) {
      return value.map((d, key) => {
        return recurse(d, [...path, key])
      })
    }
    return value
  }
  return recurse(value)
}
