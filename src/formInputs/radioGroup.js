import React from 'react'
import PropTypes from 'prop-types'
//
import FormInput from '../formInput'

export default class RadioGroup extends React.Component {
  static childContextTypes = {
    formRadioGroup: PropTypes.object,
  }
  getChildContext () {
    return {
      formRadioGroup: this,
    }
  }
  render () {
    const {
      field,
      showErrors,
      errorBefore = true,
      isForm,
      errorProps,
      children,
      ...rest
    } = this.props
    return (
      <FormInput
        field={field}
        showErrors={showErrors}
        errorBefore={errorBefore}
        isForm={isForm}
        errorProps={errorProps}
      >
        {api => {
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
}
