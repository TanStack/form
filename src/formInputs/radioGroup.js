import React from 'react'
//
import FormInput from '../formInput'

export default React.createClass({
  childContextTypes: {
    formRadioGroup: React.PropTypes.object
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
