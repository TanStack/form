import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class TextAreaWrapper extends Component {
  render () {
    const { onChange, onBlur, fieldApi, ...rest } = this.props

    const { getValue, setValue, setTouched } = fieldApi

    return (
      <textarea
        {...rest}
        value={getValue() || ''}
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
    )
  }
}

const TextArea = withFormField(TextAreaWrapper)

export default TextArea
