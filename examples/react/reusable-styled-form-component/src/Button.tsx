import * as React from 'react'

import { type buttonVariantProps, buttonVariants } from './variants'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  buttonVariantProps

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, base = true, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ className, base, variant, size })}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button, type ButtonProps }
