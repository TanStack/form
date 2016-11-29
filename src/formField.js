import React from 'react'
//
import _ from './utils'

export default function FormField ({field, children}, context) {
  const bind = (cb, ...args) => (...args2) => cb(...args, ...args2)
  return children(field ? _.mapValues(context.formAPI, d => bind(d, field)) : context.formAPI)
}
FormField.contextTypes = {
  formAPI: React.PropTypes.object
}
