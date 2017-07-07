import React from 'react'
import classnames from 'classnames'

import FormField from './formField'
import FormError from './formError'

export default function FormInput ({
  field,
  showErrors = true,
  errorBefore,
  isForm,
  className,
  children,
  errorProps = {},
}) {
  return (
    <FormField field={field}>
      {({ ...api }) => {
        const showAnyErrors =
          showErrors && (isForm ? api.getTouched() === true : true)
        const classes = classnames(
          'FormInput',
          {
            '-hasError': showAnyErrors && api.getTouched() && api.getError(),
          },
          className
        )

        return (
          <div className={classes}>
            {errorBefore &&
              showAnyErrors &&
              <FormError field={field} {...errorProps} />}
            {children({
              ...api,
            })}
            {!errorBefore &&
              showAnyErrors &&
              <FormError field={field} {...errorProps} />}
          </div>
        )
      }}
    </FormField>
  )
}
