import React from 'react'
import _ from './utils'

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
        return Object.assign({
          onValidationFail: () => {},
          preValidate: values => values,
          validate: () => null,
          onChange: () => {},
          preSubmit: values => values,
          onSubmit: () => {}
        }, config)
      },
      getInitialState () {
        const values = Object.assign({}, config.defaultValues, _.clone(this.props.values))
        return {
          values,
          touched: {},
          errors: this.validate(values),
          nestedErrors: {}
        }
      },
      componentWillMount () {
        this.emitChange(this.state)
      },
      componentWillReceiveProps (props) {
        if (props.values === this.props.values) {
          return
        }

        this.setFormState({
          values: _.clone(props.values)
        }, true)
      },

      // API
      setValue (field, value) {
        const state = this.state
        const values = _.set(state.values, field, value)
        // Also set touched since the value is changing
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
      setAllTouched () {
        this.setFormState({dirty: true})
      },
      submitForm (e) {
        e && e.preventDefault && e.preventDefault(e)
        this.setAllTouched()
        const state = this.state
        if (state.errors) {
          return this.props.onValidationFail()
        }
        this.props.onSubmit(this.props.preSubmit(this.state.values))
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
          newState.values = this.props.preValidate(newState.values)
          newState.errors = this.validate(newState.values)
        }
        this.setState(newState, () => {
          if (!silent) {
            this.emitChange(this.state)
          }
        })
      },
      emitChange (state) {
        this.props.onChange(state)
      },
      validate (values) {
        return cleanErrors(this.props.validate(removeNestedErrorValues(values, this.state ? this.state.nestedErrors : {})))
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
    const found = _.pickBy(resolved, d => typeof d !== 'undefined')
    return Object.keys(found).length ? found : undefined
  }
  if (_.isArray(err)) {
    const resolved = err.map(cleanErrors)
    const found = resolved.filter(d => typeof d !== 'undefined')
    return found.length ? found : undefined
  }
  return typeof err !== 'undefined' ? err : undefined
}

function removeNestedErrorValues (value, nestedErrors) {
  const recurse = (value, path = []) => {
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
    if (_.get(nestedErrors, path)) {
      return undefined
    }
    return value
  }
  return recurse(value)
}
