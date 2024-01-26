import * as React from 'react'
import { type inputVariantProps, inputVariants } from './variants'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  Omit<inputVariantProps, 'type'> & {
    invalid?: boolean
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid = false, ...props }, ref) => {
    return (
      <input
        className={inputVariants({
          className,
          type,
          invalid,
        } as inputVariantProps)}
        type={type}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input, inputVariants, type InputProps }
