import React from 'react'
import classnames from 'classnames'

import FormField from './formField'
import FormError from './formError'

export default function FormInput ({ field, showErrors = true, children }) {
  return (
    <FormField field={field}>
      {({ ...api }) => {
        const classes = classnames('FormInput', {
          '-error': showErrors && api.getTouched() && api.getError()
        })

        return (
          <div className={classes}>
            {children({
              ...api
            })}
            {showErrors && (
              <FormError field={field} />
            )}
          </div>
        )
      }}
    </FormField>
  )
}
