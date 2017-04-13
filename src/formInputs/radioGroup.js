import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
//
import FormInput from '../formInput'

export default createClass({
  childContextTypes: {
    formRadioGroup: PropTypes.object
  },
  getChildContext () {
    return {
      formRadioGroup: this
    }
  },
  render () {
    const { field, showErrors, errorBefore = true, isForm, children, ...rest } = this.props
    return (
      <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
        {(api) => {
          Object.assign(this, api)
          return (
            <radiogroup {...rest}>
              {children}
            </radiogroup>
          )
        }}
      </FormInput>
    )
  }
})
