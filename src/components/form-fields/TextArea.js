import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class TextAreaWrapper extends Component {
  render () {
    const { onChange, onBlur, value, setValue, setTouched, ...rest } = this.props

    return (
      <textarea
        {...rest}
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
    )
  }
}

const TextArea = withFormField(TextAreaWrapper)

export default TextArea
