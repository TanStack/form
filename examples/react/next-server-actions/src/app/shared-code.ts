import * as React from 'react'

export const data = {
  useForm: <T>(val: T) => {
    return Object(React).useState(val)
  },
  name: 'server',
}
