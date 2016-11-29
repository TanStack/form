import React from 'react'
import classnames from 'classnames'
//
import FormField from './formField'

export default function FormError ({field, className, style}) {
  return (
    <FormField field={field}>
      {({getTouched, getError}) => {
        const touched = getTouched()
        const error = getError()
        const styles = {
          display: touched && error ? 'block' : 'none'
        }
        const classes = classnames('FormError', className)
        return (
          <div
            className={classes}
            style={Object.assign({}, styles, style)}
          >
            {touched ? error : ''}
          </div>
        )
      }}
    </FormField>
  )
}
