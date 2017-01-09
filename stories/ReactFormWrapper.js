import React from 'react'
import { action } from '@kadira/storybook-addon-actions'

export default ({children}) => {
  return (
    <div className='form_wrapper'>
      {React.cloneElement(children, {
        onSubmit: action('submitted')
      })}
    </div>
  )
}
