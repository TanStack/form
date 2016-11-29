import React from 'react'
import classnames from 'classnames'

import FormField from './formField'
import FormError from './formError'

export default function FormInput ({ field, showErrors = true, errorBefore, children }) {
  return (
    <FormField field={field}>
      {({ ...api }) => {
        const classes = classnames('FormInput', {
          '-hasError': showErrors && api.getTouched() && api.getError()
        })

        return (
          <div className={classes}>
            {errorBefore && showErrors && (
              <FormError field={field} />
            )}
            {children({
              ...api
            })}
            {!errorBefore && showErrors && (
              <FormError field={field} />
            )}
          </div>
        )
      }}
    </FormField>
  )
}
