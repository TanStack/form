import React, { Component } from 'react'
import PropTypes from 'prop-types'

//

export default function withRadioGroup (Comp) {
  return class extends Component {
    static contextTypes = {
      reactFormGroup: PropTypes.object,
    }
    render () {
      return (
        <Comp radioGroup={this.context.reactFormGroup} {...this.props} />
      )
    }
  }
}
