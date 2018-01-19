import React, { Component } from 'react'
import classNames from 'classnames'

//

import withFormField from '../withFormField'
import Message from './Message'
import Utils from './utils'

class TextWrapper extends Component {
  render () {
    const {
      onChange,
      onBlur,
      className,
      noMessage,
      messageBefore,
      touchValidation,
      valueValidation,
      value,
      error,
      warning,
      success,
      touched,
      setValue,
      setTouched,
      ...rest
    } = this.props

    const type = Utils.getMessageType(error, warning, success)
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value
    })

    const classes = classNames(className, 'react-form-input', 'react-form-text', {
      [`react-form-input-${type}`]: type && showValidation,
      [`react-form-text-${type}`]: type && showValidation
    })

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
        <input
          {...rest}
          className={classes}
          value={value || ''}
          onChange={e => {
            setValue(e.target.value)
            if (onChange) {
              onChange(e.target.value, e)
            }
          }}
          onBlur={e => {
            setTouched()
            if (onBlur) {
              onBlur(e)
            }
          }}
        />
        {type && showValidation && !noMessage && !messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
      </div>
    )
  }
}

const Text = withFormField(TextWrapper)

export default Text
