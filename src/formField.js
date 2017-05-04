import React from 'react'
//
import _ from './utils'

export default function FormField ({field, children}, context) {
  const bind = (cb, ...args) => (...args2) => cb(...args, ...args2)
  const formAPI = field ? _.mapValues(context.formAPI, d => bind(d, field)) : context.formAPI
  return _.normalizeComponent(children, formAPI);
}
FormField.contextTypes = {
  formAPI: React.PropTypes.object
}
