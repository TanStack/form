import React, { Component } from 'react'
import PropTypes from 'prop-types'

//

import withField from '../withField'

class RadioGroupWrapper extends Component {

  getChildContext () {
    const {
      setValue,
      setTouched,
      value,
    } = this.props.fieldApi
    return {
      reactFormGroup: {
        setValue,
        setTouched,
        value,
        onChange: this.props.onChange,
        onBlur: this.props.onBlur,
      },
    }
  }

  static childContextTypes = {
    reactFormGroup: PropTypes.object,
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const RadioGroup = withField(RadioGroupWrapper)

export default RadioGroup
