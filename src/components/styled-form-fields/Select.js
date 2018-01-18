import React, { Component } from 'react'
import classNames from 'classnames'

//

import withFormField from '../withFormField'
import Message from './Message'
import Utils from '../../utils'

class SelectWrapper extends Component {
  render () {
    const {
      fieldApi,
      options,
      onChange,
      onBlur,
      placeholder,
      className,
      noMessage,
      messageBefore,
      valueValidation,
      touchValidation,
      ...rest
    } = this.props

    const {
      getValue,
      getError,
      getWarning,
      getSuccess,
      getTouched,
      setValue,
      setTouched,
    } = fieldApi

    const error = getError()
    const warning = getWarning()
    const success = getSuccess()
    const touched = getTouched()
    const value = getValue()

    const type = Utils.getMessageType(error, warning, success)
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value,
    })

    const classes = classNames(className, 'react-form-input', 'react-form-select', {
      [`react-form-input-${type}`]: type && showValidation,
      [`react-form-select-${type}`]: type && showValidation,
    })

    const resolvedOptions = options.find(d => d.value === '')
      ? options
      : [
        {
          label: placeholder || 'Select One...',
          value: '',
          disabled: true,
        },
        ...options,
      ]

    const nullIndex = resolvedOptions.findIndex(d => d.value === '')
    const selectedIndex = resolvedOptions.findIndex(d => d.value === getValue())

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
        <div className={classes}>
          <select
            {...rest}
            value={selectedIndex > -1 ? selectedIndex : nullIndex}
            onChange={e => {
              const val = resolvedOptions[e.target.value].value
              setValue(val)
              if (onChange) {
                onChange(val, e)
              }
            }}
            onBlur={e => {
              setTouched()
              if (onBlur) {
                onBlur(e)
              }
            }}
          >
            {resolvedOptions.map((option, i) => (
              <option key={option.value} value={i} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="react-form-select-arrow" />
        </div>
        {type && showValidation && !noMessage && !messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
      </div>
    )
  }
}

const Select = withFormField(SelectWrapper)

export default Select
