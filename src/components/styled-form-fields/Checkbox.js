import React, { Component } from 'react'
import classNames from 'classnames'

//

import withFormField from '../withFormField'
import Message from './Message'
import Utils from './utils'

class CheckboxWrapper extends Component {
  render () {
    const {
      value,
      setValue,
      setTouched,
      error,
      warning,
      success,
      touched,
      onChange,
      onBlur,
      label,
      noMessage,
      messageBefore,
      valueValidation,
      touchValidation,
      ...rest
    } = this.props

    const type = Utils.getMessageType(error, warning, success)
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value
    })

    const labelClasses = classNames(
      'react-form-control',
      'react-form-control-checkbox',
      rest.className || ''
    )

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-checkbox',
      {
        [`react-form-input-${type}`]: type && showValidation,
        [`react-form-checkbox-${type}`]: type && showValidation
      }
    )

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
        <label className={labelClasses} htmlFor={rest.id}>
          {label}
          <input
            {...rest}
            checked={!!value}
            onChange={e => {
              setValue(e.target.checked)
              if (onChange) {
                onChange(e.target.checked, e)
              }
            }}
            onBlur={e => {
              setTouched()
              if (onBlur) {
                onBlur(e)
              }
            }}
            type="checkbox"
          />
          <div className={indicatorClasses} />
        </label>
        {type && showValidation && !noMessage && !messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
      </div>
    )
  }
}

const Checkbox = withFormField(CheckboxWrapper)

export default Checkbox
