import React from 'react'
import Field from './Field'

//

export default function withField (Comp, defaults) {
  return function ConnectedField (props) {
    return <Field component={Comp} {...defaults} {...props} />
  }
}
