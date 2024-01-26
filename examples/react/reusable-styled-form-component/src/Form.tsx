import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { cx } from './utils'
import { Input } from './Input'
import { Label } from './Label'
import { Select } from './Select'
import { Button } from './Button'

type FormProps = any

type FormFieldProps = any

type FormFieldTextProps = any

type FormFieldCheckboxProps = any

type FormFieldSelectProps = any

type FormFieldErrorProps = any

type FormSubscribeProps = any

type FormSubmitButtonProps = any

type FormResetButtonProps = any

type FormComponentProps = React.ForwardRefExoticComponent<FormProps> & {
  Subscribe: FormSubscribeProps
  Field: FormFieldProps & {
    Error: React.FC<FormFieldErrorProps>
    Text: React.FC<FormFieldTextProps>
    Checkbox: React.FC<FormFieldCheckboxProps>
    Select: React.FC<FormFieldSelectProps>
  }
  SubmitButton: React.FC<FormSubmitButtonProps>
  ResetButton: React.FC<FormResetButtonProps>
}

const FormContext = React.createContext<any>({})

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, formOptions, ...props }, ref) => {
    const { Provider, Field, handleSubmit, useStore, Subscribe, reset } =
      useForm({
        validatorAdapter: zodValidator,
        ...formOptions,
      })
    return (
      <Provider>
        <form
          className={className}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }}
          ref={ref}
          {...props}
        >
          <FormContext.Provider value={{ Field, Subscribe, reset }}>
            {typeof children === 'function' ? children(useStore) : children}
          </FormContext.Provider>
        </form>
      </Provider>
    )
  },
) as FormComponentProps

Form.displayName = 'Form'

Form.Subscribe = React.forwardRef<FormFieldProps>(({ ...props }, ref) => {
  const { Subscribe } = React.useContext(FormContext)
  return <Subscribe ref={ref} {...props} />
})

Form.Subscribe.displayName = 'Form.Subscribe'

Form.Field = React.forwardRef<FormFieldProps>(({ ...props }, ref) => {
  const { Field } = React.useContext(FormContext)
  return <Field ref={ref} {...props} />
})

Form.Field.displayName = 'Form.Field'

Form.Field.Text = React.forwardRef<HTMLInputElement, FormFieldTextProps>(
  ({ className, hasErrorField, field, label, ...props }, ref) => {
    return (
      <div className="flex relative">
        <Input
          className={cx(
            'placeholder:text-white dark:placeholder:text-black',
            className,
          )}
          invalid={field.state.meta.errors.length !== 0}
          type="text"
          id={field.name}
          name={field.name}
          placeholder={label}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-describedby={
            hasErrorField && field.state.meta.errors.length !== 0
              ? `${field.name}-error`
              : ''
          }
          aria-invalid={field.state.meta.errors.length !== 0}
          ref={ref}
          {...props}
        />
        {label && (
          <Label
            className={cx(
              'pointer-events-none absolute origin-left translate-x-[5px] translate-y-[9px] scale-100 rounded-md bg-white dark:bg-black px-2 py-1 font-normal text-gray-500 transition peer-focus:-translate-y-[11px] peer-focus:translate-x-[7px] peer-focus:scale-[calc(12/14)] peer-focus:text-blue-500 peer-[:not(:placeholder-shown):not(:focus)]:-translate-y-[11px] peer-[:not(:placeholder-shown):not(:focus)]:translate-x-[7px] peer-[:not(:placeholder-shown):not(:focus)]:scale-[calc(12/14)] peer-[:not(:placeholder-shown):not(:focus)]:text-gray-500',
              field.state.meta.errors.length !== 0 &&
                'peer-focus:text-red-500 peer-[:not(:placeholder-shown):not(:focus)]:text-red-500',
            )}
            htmlFor={field.name}
          >
            {label}
          </Label>
        )}
      </div>
    )
  },
)

Form.Field.Text.displayName = 'Form.Field.Text'

Form.Field.Checkbox = React.forwardRef<
  HTMLInputElement,
  FormFieldCheckboxProps
>(({ className, children, field, label, ...props }, ref) => {
  return (
    <div className="flex relative items-center gap-2">
      <Input
        className={className}
        type="checkbox"
        id={field.name}
        name={field.name}
        placeholder={label}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.checked)}
        ref={ref}
        {...props}
      />
      {label && (
        <Label className="cursor-pointer" htmlFor={field.name}>
          {label}
        </Label>
      )}
    </div>
  )
})

Form.Field.Checkbox.displayName = 'Form.Field.Checkbox'

Form.Field.Select = React.forwardRef<HTMLSelectElement, FormFieldSelectProps>(
  ({ className, hasErrorField, field, label, ...props }, ref) => {
    return (
      <div className="flex flex-col relative gap-2">
        {label && (
          <Label className="cursor-pointer" htmlFor={field.name}>
            {label}
          </Label>
        )}
        <Select
          className={className}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-describedby={
            hasErrorField && field.state.meta.errors.length !== 0
              ? `${field.name}-error`
              : ''
          }
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

Form.Field.Select.displayName = 'Form.Field.Select'

Form.Field.Error = React.forwardRef<HTMLSpanElement, FormFieldErrorProps>(
  ({ className, field, ...props }, ref) => {
    return (
      <>
        <ExclamationCircleIcon
          className={cx(
            'absolute h-4 w-4 translate-x-[3px] translate-y-px text-red-500 opacity-0 transition-opacity',
            field.state.meta.errors.length !== 0 && 'opacity-100',
          )}
        />
        <span
          className={cx(
            'absolute translate-x-5 leading-none translate-y-px text-xs text-red-500 opacity-0 transition-opacity',
            field.state.meta.errors.length !== 0 && 'opacity-100',
          )}
          id={`${field.name}-error`}
          aria-hidden={field.state.meta.errors.length !== 0 ? 'false' : 'true'}
          ref={ref}
          {...props}
        >
          {field.state.meta.errors.length !== 0 &&
            field.state.meta.errors[0].split(', ')[0]}
        </span>
      </>
    )
  },
)

Form.Field.Error.displayName = 'Form.Field.Error'

Form.SubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            className={className}
            variant="primary"
            size="md"
            type="submit"
            disabled={!canSubmit}
            ref={ref}
            {...props}
          />
        )}
      </Form.Subscribe>
    )
  },
)

Form.SubmitButton.displayName = 'Form.SubmitButton'

Form.ResetButton = React.forwardRef<HTMLButtonElement, FormResetButtonProps>(
  ({ className, ...props }, ref) => {
    const { reset } = React.useContext(FormContext)
    return (
      <Form.Subscribe selector={(state) => state.submissionAttempts}>
        {(submissionAttempts) => (
          <Button
            className={cx('text-blue-500 dark:text-blue-500', className)}
            disabled={submissionAttempts === 0}
            onClick={() => reset()}
            variant="ghost"
            size="xs"
            ref={ref}
            {...props}
          />
        )}
      </Form.Subscribe>
    )
  },
)

Form.ResetButton.displayName = 'Form.ResetButton'

export {
  Form,
  type FormProps,
  type FormFieldProps,
  type FormFieldTextProps,
  type FormFieldErrorProps,
  type FormFieldCheckboxProps,
  type FormFieldSelectProps,
  type FormComponentProps,
}
