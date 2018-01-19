import React, { Component } from 'react'
import classNames from 'classnames'

//

import withField from '../withField'
import Utils from './utils'

class RadioComp extends Component {
  render () {
    const {
      fieldApi: { value, setValue, setTouched, error, warning, success, touched },
      onClick,
      group,
      value: parentValue,
      label,
      className,
      valueValidation,
      touchValidation,
      onChange,
      onBlur,
      ...rest
    } = this.props

    const type = Utils.getMessageType(error, warning, success)
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value
    })

    const labelClasses = classNames(className, 'react-form-control', 'react-form-control-radio')

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-radio',
      {
        [`react-form-input-${type}`]: type && showValidation,
        [`react-form-radio-${type}`]: type && showValidation
      }
    )

    return (
      <label className={labelClasses} htmlFor={rest.id}>
        {label}
        <input
          {...rest}
          checked={parentValue === value}
          onChange={e => {
            if (!e.target.checked) {
              return
            }
            setValue(value)
            if (onChange) {
              onChange(value, e)
            }
            if (onClick) {
              onClick(e)
            }
          }}
          onBlur={e => {
            setTouched()
            if (onBlur) {
              onBlur(e)
            }
          }}
          type="radio"
        />
        <div className={indicatorClasses} />
      </label>
    )
  }
}

const Radio = withField(RadioComp)

export default Radio
