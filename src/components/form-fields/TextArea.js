import React, { Component } from 'react'

//

import withField from '../withField'

class TextAreaWrapper extends Component {
  render () {
    const { fieldApi: { value, setValue, setTouched }, onChange, onBlur, ...rest } = this.props

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

const TextArea = withField(TextAreaWrapper)

export default TextArea
