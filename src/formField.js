import React from 'react'
//
import _ from './utils'

export default function FormField ({field, children: Child}, context) {
  const bind = (cb, ...args) => (...args2) => cb(...args, ...args2)
  const formAPI = field ? _.mapValues(context.formAPI, d => bind(d, field)) : context.formAPI
  return <Child {...formAPI} />
}
FormField.contextTypes = {
  formAPI: React.PropTypes.object
}
