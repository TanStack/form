import { createProvider, connect as reduxConnect } from 'react-redux'

const STORE_KEY = 'react-form-context'

export const Provider = createProvider(STORE_KEY)

export function connect (mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  options.storeKey = STORE_KEY
  return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps, options)
}
