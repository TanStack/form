import React from 'react'

import FieldApi from './FieldApi'

//

export default function withFieldApi (name) {
  return Comp => props => <FieldApi component={Comp} field={name} {...props} />
}
