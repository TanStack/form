import PropTypes from 'prop-types'
//
import _ from './utils'

export default function FormField ({ field, children }, context) {
  const bind = (fn, ...args) => (...args2) => fn(...args, ...args2)
  return children(
    field ? _.mapValues(context.formAPI, d => bind(d, field)) : context.formAPI
  )
}
FormField.contextTypes = {
  formAPI: PropTypes.object,
}
