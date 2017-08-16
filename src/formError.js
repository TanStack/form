import React from 'react'
import classnames from 'classnames'
//
import FormField from './formField'

export default function FormError ({ field, className, style }) {
  return (
    <FormField field={field}>
      {({ getTouched, getError }) => {
        const touched = getTouched()
        const error = getError()
        if (!(touched && typeof error === 'string' && error)) {
          return null
        }
        const classes = classnames('FormError', className)
        return (
          <div className={classes} style={style}>
            {error}
          </div>
        )
      }}
    </FormField>
  )
}
