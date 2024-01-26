import * as React from 'react'

import { cx } from './utils'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
  value?: string
}

type SelectOptionGroupProps = React.OptgroupHTMLAttributes<HTMLOptGroupElement>

type SelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement> & {
  value: string
  displayValue?: string
}

type SelectComponentProps = React.ForwardRefExoticComponent<SelectProps> & {
  OptionGroup: React.FC<SelectOptionGroupProps>
  Option: React.FC<SelectOptionProps>
}

const SelectContext = React.createContext<SelectProps['value']>('')

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <SelectContext.Provider value={value}>
        <select
          className={cx(
            'h-10 w-full cursor-pointer rounded-md border border-gray-300 bg-white dark:bg-black px-3 py-2 text-sm transition-border focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 focus-visible:dark:border-blue-500',
            className,
          )}
          value={value}
          ref={ref}
          {...props}
        />
      </SelectContext.Provider>
    )
  },
) as SelectComponentProps

Select.displayName = 'Select'

Select.OptionGroup = React.forwardRef<
  HTMLOptGroupElement,
  SelectOptionGroupProps
>(({ ...props }, ref) => {
  return <optgroup ref={ref} {...props} />
})

Select.OptionGroup.displayName = 'Select.OptionGroup'

Select.Option = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ children, value, displayValue, ...props }, ref) => {
    const selectedValue = React.useContext(SelectContext)
    return (
      <option value={value} ref={ref} {...props}>
        {selectedValue === value && displayValue !== undefined
          ? displayValue
          : children}
      </option>
    )
  },
)

Select.Option.displayName = 'Select.Option'

export {
  Select,
  type SelectProps,
  type SelectOptionGroupProps,
  type SelectOptionProps,
}
