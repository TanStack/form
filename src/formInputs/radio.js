import React from 'react'
import PropTypes from 'prop-types'
//
import { buildHandler } from './util'
const noop = () => {}

export default React.createClass({
  contextTypes: {
    formRadioGroup: PropTypes.object
  },
  render () {
    const { value, onClick, onChange, onBlur, inputRef, ...rest } = this.props
    const {setValue, getValue, setTouched, props: { noTouch }} = this.context.formRadioGroup
    return (
      <input
        {...rest}
        ref={inputRef}
        type='radio'
        checked={getValue(false) === value}
        onChange={buildHandler(onChange, noop)}
        onClick={buildHandler(onClick, e => setValue(value, noTouch))}
        onBlur={buildHandler(onBlur, () => setTouched())}
      />
    )
  }
})
