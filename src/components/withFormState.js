import React from 'react'
import FormState from './FormState'

//

export default function withFormState (Comp, defaults) {
  return function ConnectedFormState (props) {
    return <FormState component={Comp} {...defaults} {...props} />
  }
}
