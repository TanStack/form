import React from 'react'
import FieldContext from './FieldContext'

//

export default function withFieldContext (Comp, defaults) {
  return function ConnectedFieldContext (props) {
    return <FieldContext component={Comp} {...defaults} {...props} />
  }
}
