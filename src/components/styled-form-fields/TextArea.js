import React, { Component } from 'react'
import classNames from 'classnames'

//

import withFormField from '../withFormField'
import Message from './Message'
import Utils from './utils'

class TextAreaWrapper extends Component {
  render () {
    const {
      value,
      error,
      warning,
      success,
      touched,
      setValue,
      setTouched,
      onChange,
      onBlur,
      className,
      noMessage,
      messageBefore,
      touchValidation,
      valueValidation,
      ...rest
    } = this.props

    const type = Utils.getMessageType(error, warning, success)
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value
    })

    const classes = classNames(className, 'react-form-input', 'react-form-textarea', {
      [`react-form-input-${type}`]: type && showValidation,
      [`react-form-textarea-${type}`]: type && showValidation
    })

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message message={Utils.getMessage(error, warning, success)} type={type} />
        ) : null}
        <textarea
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

const TextArea = withFormField(TextAreaWrapper)

export default TextArea
