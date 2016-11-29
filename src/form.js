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
          formAPI: {
            setValue: this.setValue,
            getValue: this.getValue,
            getError: this.getError,
            setTouched: this.setTouched,
            getTouched: this.getTouched
          }
        }
      },
      // Lifecycle
      getDefaultProps () {
        return Object.assign({
          values: {},
          onChange: () => {},
          onValidationFail: () => {}
        }, config)
      },
      getInitialState () {
        const values = Object.assign({}, config.defaultValues, _.clone(this.props.values))
        return {
          values,
          touched: {},
          errors: this.validate(values)
        }
      },
      componentWillMount () {
        this.emitChange(this.state)
      },
      componentWillReceiveProps (props) {
        if (
          props.values !== this.props.values
        ) {
          return this.setFormState({
            values: props.values === undefined ? this.state.values : _.clone(props.values)
          }, true)
        }
      },

      // API
      setValue (field, value) {
        const state = this.state
        const values = state.values
        _.set(values, field, value)
        this.setFormState({values})
      },
      getValue (field, fallback) {
        const state = this.state
        const val = !field ? state.values : _.get(state.values, field)
        return typeof val !== 'undefined' ? val : fallback
      },
      getError (field, includeObj) {
        const state = this.state
        const err = !field ? state.errors : _.get(state.errors, field)
        return includeObj ? err : typeof err !== 'object' ? err : null
      },
      setTouched (field, value = true) {
        const touched = this.state.touched
        _.set(touched, field, value)
        this.setFormState({touched})
      },
      getTouched (field, includeObj) {
        const state = this.state
        if (this.state.dirty === true || this.props.touched) {
          return true
        }
        const val = !field ? state.touched : _.get(state.touched, field)
        return includeObj ? val : val === true
      },
      setAllTouched () {
        this.setFormState({dirty: true})
      },
      submitForm (e) {
        e.preventDefault(e)
        this.setAllTouched()
        const state = this.state
        if (state.errors) {
          return this.props.onValidationFail()
        }
        if (this.props.onSubmit) {
          this.props.onSubmit(this.state.values)
        } else {
          console.warn('No onSubmit prop found!', this)
        }
      },

      // Utils
      setFormState (newState, silent) {
        if (newState && newState.values) {
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
        if (!this.props.validate) {
          return
        }
        return cleanErrors(this.props.validate(values))
      },
      // Render
      render () {
        const props = {
          ...this.props,
          ...this.state,
          submitForm: this.submitForm,
          setValue: this.setValue,
          getValue: this.getValue,
          getError: this.getError,
          setTouched: this.setTouched,
          getTouched: this.getTouched
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
    const resolved = _.map(err, cleanErrors)
    const found = resolved.filter(d => typeof d !== 'undefined')
    return found.length ? found : undefined
  }
  return typeof err !== 'undefined' ? err : undefined
}
