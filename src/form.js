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
          errors: this.validate(values)
        }
      },
      componentWillMount () {
        this.emitChange(this.state)
      },
      componentWillReceiveProps (props) {
        // This condition is used to disallow clobbering a nested form's
        // values as a result of a nested forms error object being undefined.
        // See the nested form component and setFormState for more information.
        const wasUndefined = this.expectUndefinedValues
        this.expectUndefinedValues = false
        if (props.values === undefined && wasUndefined) {
          return
        }

        this.setFormState({
          values: _.clone(props.values)
        }, true)
      },

      // API
      setValue (field, value) {
        const state = this.state
        const values = state.values
        _.set(values, field, value)
        // Also set touched since the value is changing
        const touched = state.touched
        _.set(touched, field, value)
        this.setFormState({values, touched})
      },
      getValue (field, fallback) {
        const state = this.state
        const val = !field ? state.values : _.get(state.values, field)
        return typeof val !== 'undefined' ? val : fallback
      },
      getError (field) {
        return _.get(this.state.errors, field)
      },
      setTouched (field, value = true) {
        const touched = this.state.touched
        _.set(touched, field, value)
        this.setFormState({touched})
      },
      getTouched (field) {
        const state = this.state
        if (this.state.dirty === true || this.props.touched) {
          return true
        }
        return _.get(state.touched, field)
      },
      addValue (field, value) {
        const state = this.state
        const values = state.values
        _.set(values, field, [
          ..._.get(values, field, []),
          value
        ])
        this.setFormState({values})
      },
      removeValue (field, index) {
        const state = this.state
        const values = state.values
        const fieldValue = _.get(values, field, [])
        _.set(values, field, [
          ...fieldValue.slice(0, index),
          ...fieldValue.slice(index + 1)
        ])
        this.setFormState({values})
      },
      swapValue (field, index, destIndex) {
        const state = this.state
        const values = state.values
        const fieldValues = _.get(values, field, [])
        _.set(values, field, [
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
          getError: this.getError,
          setTouched: this.setTouched,
          getTouched: this.getTouched,
          addValue: this.addValue,
          removeValue: this.removeValue,
          swapValue: this.swapValue,
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
            if (this.state.errors) {
              // This is a bit hacky for now, but to keep nested forms that
              // have errors from reingesting undefined values given to their
              // parent form, we set a temporary flag for the nested form to
              // expect an undefined value and not clobber the nested form's
              // state.
              this.expectUndefinedValues = true
            }
            this.emitChange(this.state)
          }
        })
      },
      emitChange (state) {
        this.props.onChange(state)
      },
      validate (values) {
        return cleanErrors(this.props.validate(values))
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
