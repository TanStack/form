import React from 'react'
//
export default React.createClass({
  contextTypes: {
    formRadioGroup: React.PropTypes.object
  },
  render () {
    const { value, ...rest } = this.props
    const {setValue, getValue, setTouched, props: { noTouch }} = this.context.formRadioGroup
    return (
      <input
        {...rest}
        type='radio'
        checked={getValue(false) === value}
        onClick={e => setValue(value, noTouch)}
        onBlur={() => setTouched()}
      />
    )
  }
})
