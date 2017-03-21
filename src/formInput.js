import React from 'react'
import classnames from 'classnames'

import FormField from './formField'
import FormError from './formError'

export default function FormInput ({ field, showErrors = true, errorBefore, isForm, className, children: Child }) {
  return (
    <FormField field={field}>
      {({ ...api }) => {
        const showAnyErrors = showErrors && (isForm ? api.getTouched() === true : true)
        const classes = classnames('FormInput', {
          '-hasError': !errorBefore && showAnyErrors && api.getTouched() && api.getError()
        }, className)

        return (
          <div className={classes}>
            {errorBefore && showAnyErrors && (
              <FormError field={field} />
            )}
            <Child {...api} />
            {!errorBefore && showAnyErrors && (
              <FormError field={field} />
            )}
          </div>
        )
      }}
    </FormField>
  )
}
