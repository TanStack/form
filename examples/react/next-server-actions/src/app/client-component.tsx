/// <reference types="../../node_modules/@types/react-dom/experimental" />
'use client'

import { useFormState } from 'react-dom'
import someAction from './action'

export const ClientComp = () => {
  const [data, action] = useFormState(someAction, 'Hello client')

  return (
    <form action={action as never}>
      <p>{data}</p>
      <button type={'submit'}>Update data</button>
    </form>
  )
}
