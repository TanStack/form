import React from 'react'
//
import { buildHandler } from './util'
const noop = () => {}

export default React.createClass({
  contextTypes: {
    formRadioGroup: React.PropTypes.object
  },
  render () {
    const { value, onClick, onChange, onBlur, ...rest } = this.props
    const {setValue, getValue, setTouched, props: { noTouch }} = this.context.formRadioGroup
    return (
      <input
        {...rest}
        type='radio'
        checked={getValue(false) === value}
        onChange={buildHandler(onChange, noop)}
        onClick={buildHandler(onClick, e => setValue(value, noTouch))}
        onBlur={buildHandler(onBlur, () => setTouched())}
      />
    )
  }
})
