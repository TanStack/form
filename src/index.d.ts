declare module 'react-form' {
  import {
    ChangeEventHandler,
    ComponentType,
    Dispatch,
    FocusEventHandler,
    FormEventHandler,
    HTMLProps,
    Provider,
    SetStateAction,
  } from 'react'

  type Debounce = <T>(fn: (...args: any[]) => T, wait: number) => Promise<T>
  type ValidatorReturn = string | false | undefined
  type OptionalPromise<T> = Promise<T> | T

  interface FormMeta {
    error: string | any
    isSubmitting: boolean
    isDirty: boolean
    isSubmitted: boolean
    submissionAttempts: number
    isValid: boolean
    fieldsAreValidating: boolean
    fieldsAreValid: boolean
    canSubmit: boolean
    [k: string]: any
  }

  type SetFormMeta = Partial<FormMeta> | ((previousMeta: FormMeta) => FormMeta)

  interface FormInstance<T> {
    Form: ComponentType<Omit<HTMLProps<HTMLFormElement>, 'onSubmit'>>
    values: T
    meta: FormMeta
    formContext: FormInstance<T>
    reset: () => void
    setMeta: (value: SetFormMeta) => void
    handleSubmit: FormEventHandler<HTMLFormElement>
    debounce: Debounce
    setValues: Dispatch<SetStateAction<T>>
    runValidation: () => void
    getFieldValue: <V = any>(fieldPath: keyof T | string) => V
    getFieldMeta: (
      fieldPath: keyof T | string
    ) => { error: string | null; [k: string]: any }
    setFieldValue: <V = any>(
      fieldPath: keyof T | string,
      updater: SetValue<V>,
      options?: { isTouched: boolean }
    ) => void
    setFieldMeta: (fieldPath: keyof T | string, value: SetFieldMeta) => void
    pushFieldValue: <V = any>(fieldPath: keyof T | string, value: V) => void
    insertFieldValue: <V = any>(
      fieldPath: keyof T | string,
      insertIndex: number,
      value: V
    ) => void
    removeFieldValue: (
      fieldPath: keyof T | string,
      removalIndex: number
    ) => void
    swapFieldValues: (
      fieldPath: keyof T | string,
      firstIndex: number,
      secondIndex: number
    ) => void
  }

  interface FormOptions<T> {
    defaultValues: T
    onSubmit: (values: T, instance: FormInstance<T>) => OptionalPromise<void>
    validate: (
      values: Partial<T>,
      instance: FormInstance<T>
    ) => OptionalPromise<ValidatorReturn>
    validatePristine?: boolean
    debugForm: boolean
  }

  export function useForm<T extends {} = {}>(
    options?: Partial<FormOptions<T>>
  ): FormInstance<T>

  export function useFormContext<T extends {} = {}>(): FormInstance<T>

  interface FieldMeta {
    error: string | false
    isTouched: boolean
    [k: string]: any
  }

  type SetValue<S> = S | ((prevState: S) => S)
  type SetFieldMeta =
    | Partial<FieldMeta>
    | ((previousMeta: FieldMeta) => FieldMeta)

  interface FieldInstance<T = any, F = any> {
    form: FormInstance<F>
    fieldName: string
    value: T
    meta: FieldMeta
    FieldScope?: ComponentType<Provider<any>>
    debounce: Debounce
    runValidation: () => void
    getInputProps: (
      value: Partial<HTMLProps<HTMLInputElement>> &
        Pick<HTMLProps<HTMLInputElement>, 'onSubmit'> &
        Pick<HTMLProps<HTMLInputElement>, 'onBlur'>
    ) => {
      value: string | string[] | number
      onChange: ChangeEventHandler<HTMLInputElement>
      onBlur: FocusEventHandler<HTMLInputElement>
    } & Partial<HTMLProps<HTMLInputElement>>
    setValue: <V = any>(
      updater: SetValue<V>,
      options?: { isTouched: boolean }
    ) => void
    setMeta: (value: SetFieldMeta) => void
    pushValue: <V = any>(value: V) => void
    insertValue: <V = any>(insertIndex: number, value: V) => void
    removeValue: (removalIndex: number) => void
    swapValues: (firstIndex: number, secondIndex: number) => void
  }

  interface FieldOptions<T> {
    defaultValue?: T
    defaultError?: string
    defaultIsTouched?: boolean
    defaultMeta?: FieldMeta
    validate?: (
      value: T,
      instance: FieldInstance
    ) => OptionalPromise<ValidatorReturn>
    filterValue?: <T = any>(values: T, instance: FieldInstance) => T
    validatePristine?: boolean
  }

  export function useField<T = any>(
    fieldPath: string,
    options?: FieldOptions<T>
  ): FieldInstance

  interface FieldOptionProps<T = any, Form = any>
    extends FieldOptions<T> {
    onSubmit?: (value: T, instance: FormInstance<Form>) => OptionalPromise<void>
    defaultValues?: Form
    debugForm?: boolean
  }

  export function splitFormProps<P = {}, T = any>(
    props: FieldProps<T> & P
  ): [typeof props['field'], FieldOptionProps<T>, P]

  export interface FieldProps<T = any> extends FieldOptionProps<T> {
    field: string
  }
}
