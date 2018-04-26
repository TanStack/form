import React, { Component } from 'react'

//

import withField from '../withField'

class TextWrapper extends Component {
  setElem = elem => {
    const { ref } = this.props
    this.elem = elem
    if (ref) {
      ref(elem)
    }
  }
  elem = null

  componentDidMount () {
    const { value, fieldApi: { setTouched, setValue } } = this.props
    const expected = !value && value !== 0 ? '' : String(value)
    const actual = this.elem.value
    if (expected !== actual) {
      setTouched()
      setValue(actual)
    }
  }

  render () {
    const { fieldApi: { value, setValue, setTouched }, onChange, onBlur, ...rest } = this.props

    return (
      <input
        {...rest}
        ref={this.setElem}
        value={!value && value !== 0 ? '' : value}
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

const Text = withField(TextWrapper)

export default Text
