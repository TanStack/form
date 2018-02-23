import React from 'react'
import NestedField from './NestedField'

//

export default function withNestedField (Comp, defaults) {
  return function ConnectedNestedField (props) {
    return <NestedField component={Comp} {...defaults} {...props} />
  }
}
