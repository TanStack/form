import * as React from 'react'
import { type FormApi, type FormOptions, useForm } from '@tanstack/react-form'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { cx } from './utils'
import { Input } from './Input'
import { Label } from './Label'

type FormProps = any

type FormFieldProps = any

type FormFieldTextProps = any

type FormFieldCheckboxProps = any

type FormFieldSelectProps = any

type FormComponentProps = React.ForwardRefExoticComponent<FormProps> & {
  Field: FormFieldProps & {
    Text: React.ForwardRefExoticComponent<FormFieldTextProps>
    Checkbox: React.ForwardRefExoticComponent<FormFieldCheckboxProps>
    Select: React.ForwardRefExoticComponent<FormFieldSelectProps>
  }
}

type FormContextProps = FormApi<Record<string, unknown>, typeof zodValidator>

const FormContext = React.createContext<FormContextProps>(
  {} as FormContextProps,
)

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, formOptions, ...props }, ref) => {
    const HeadlessForm = useForm({
      validatorAdapter: zodValidator,
      ...formOptions,
    })

    return (
      <FormContext.Provider value={HeadlessForm}>
        <HeadlessForm.Provider>
          <form
            className={className}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void HeadlessForm.handleSubmit()
            }}
            ref={ref}
            {...props}
          />
        </HeadlessForm.Provider>
      </FormContext.Provider>
    )
  },
) as FormComponentProps

Form.displayName = 'Form'

Form.Field = ({ ...props }: FormFieldProps) => {
  const HeadlessForm = React.useContext(FormContext)
  return <HeadlessForm.Field {...props} />
}

Form.Field.displayName = 'Form.Field'

Form.Field.Text = React.forwardRef<HTMLInputElement, FormFieldTextProps>(
  ({ className, field, label, ...props }, ref) => {
    const formMessageId = `${field.name}-message`
    return (
      <div className="flex">
        <Input
          className={cx(
            'placeholder:text-white dark:placeholder:text-black',
            className,
          )}
          invalid={field.state.meta.errors.length > 0}
          type="text"
          id={field.name}
          name={field.name}
          placeholder={label}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-describedby={
            field.state.meta.errors.length > 0 ? `${formMessageId}` : ''
          }
          aria-invalid={field.state.meta.errors.length > 0}
          ref={ref}
          {...props}
        />
        <Label
          className={cx(
            'pointer-events-none absolute origin-left translate-x-[5px] translate-y-[9px] scale-100 rounded-md bg-white dark:bg-black px-2 py-1 font-normal text-gray-500 transition peer-focus:-translate-y-[11px] peer-focus:translate-x-[7px] peer-focus:scale-[calc(12/14)] peer-focus:text-blue-500 peer-[:not(:placeholder-shown):not(:focus)]:-translate-y-[11px] peer-[:not(:placeholder-shown):not(:focus)]:translate-x-[7px] peer-[:not(:placeholder-shown):not(:focus)]:scale-[calc(12/14)] peer-[:not(:placeholder-shown):not(:focus)]:text-gray-500',
            field.state.meta.errors.length > 0 &&
              'peer-focus:text-red-500 peer-[:not(:placeholder-shown):not(:focus)]:text-red-500',
          )}
          htmlFor={field.name}
        >
          {label}
        </Label>
        <ExclamationCircleIcon
          className={cx(
            'absolute h-4 w-4 translate-x-[3px] translate-y-[42px] text-blue-500 opacity-0 transition-opacity',
            field.state.meta.errors.length > 0 &&
              'peer-focus:opacity-100 text-red-500',
          )}
        />
        <span
          className={cx(
            'absolute translate-x-5 translate-y-[43px] text-xs text-gray-500 opacity-0 transition-opacity',
            field.state.meta.errors.length > 0 &&
              'peer-focus:opacity-100 text-red-500',
          )}
          aria-hidden={field.state.meta.errors.length > 0 ? 'false' : 'true'}
        >
          {field.state.meta.touchedErrors}
        </span>
      </div>
    )
  },
)

Form.Field.Text.displayName = 'Form.Field.Text'

export { Form, type FormProps, type FormFieldProps }
