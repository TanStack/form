import React from 'react'
import classnames from 'classnames'

import FormField from './formField'
import FormError from './formError'

export default function FormInput ({ field, showErrors = true, isForm, children }) {
  return (
    <FormField field={field}>
      {({ ...api }) => {
        const classes = classnames('FormInput', {
          '-hasError': !isForm && showErrors && api.getTouched() && api.getError()
        })

        return (
          <div className={classes}>
            {isForm && showErrors && (
              <FormError field={field} />
            )}
            {children({
              ...api
            })}
            {!isForm && showErrors && (
              <FormError field={field} />
            )}
          </div>
        )
      }}
    </FormField>
  )
}
