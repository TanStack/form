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

  type SerializableObject = { [key: string]: Serializable }
  interface SerializableArray extends Array<Serializable> {}
  type Serializable =
    | string
    | number
    | boolean
    | null
    | SerializableObject
    | SerializableArray

  type Debounce = <T>(fn: () => T, wait: number) => Promise<T>
  type ValidatorReturn = string | false | undefined
  type OptionalPromise<T> = Promise<T> | T
  type ValidationError = string | false | null | undefined

  interface FormMeta {
    error: ValidationError
    isSubmitting: boolean
    isDirty: boolean
    isSubmitted: boolean
    submissionAttempts: number
    isValid: boolean
    fieldsAreValidating: boolean
    fieldsAreValid: boolean
    canSubmit: boolean
  }

  type SetFormMeta<C> =
    | Partial<FormMeta & C>
    | ((previousMeta: FormMeta & C) => FormMeta & C)

  interface FormInstance<TValues, CustomFormMeta> {
    Form: ComponentType<Omit<HTMLProps<HTMLFormElement>, 'onSubmit'>>
    values: TValues
    meta: FormMeta & CustomFormMeta
    formContext: FormInstance<TValues, CustomFormMeta>
    reset: () => void
    setMeta: (value: SetFormMeta<CustomFormMeta>) => void
    handleSubmit: FormEventHandler<HTMLFormElement>
    debounce: Debounce
    setValues: Dispatch<SetStateAction<TValues>>
    runValidation: () => void
    getFieldValue: <V = unknown>(fieldPath: keyof TValues) => V
    getFieldMeta: <M = unknown>(fieldPath: keyof TValues) => FieldMeta & M
    setFieldValue: <V = unknown>(
      fieldPath: keyof TValues,
      updater: SetValue<V>,
      options?: { isTouched: boolean }
    ) => void
    setFieldMeta: <M = unknown>(
      fieldPath: keyof TValues,
      value: SetFieldMeta<M>
    ) => void
    pushFieldValue: <T extends SerializableArray>(
      fieldPath: keyof TValues,
      value: T extends (infer U)[] ? U : never
    ) => void
    insertFieldValue: <T extends SerializableArray>(
      fieldPath: keyof TValues,
      insertIndex: number,
      value: T extends (infer U)[] ? U : never
    ) => void
    removeFieldValue: (fieldPath: keyof TValues, removalIndex: number) => void
    swapFieldValues: (
      fieldPath: keyof TValues,
      firstIndex: number,
      secondIndex: number
    ) => void
  }

  interface FormOptions<TValues, CustomFormMeta> {
    defaultValues: TValues
    onSubmit: (
      values: TValues,
      instance: FormInstance<TValues, CustomFormMeta>
    ) => OptionalPromise<void>
    validate: (
      values: Partial<TValues>,
      instance: FormInstance<TValues, CustomFormMeta>
    ) => OptionalPromise<ValidatorReturn>
    validatePristine?: boolean
    debugForm: boolean
  }

  export function useForm<
    TValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  >(
    options?: Partial<FormOptions<TValues, CustomFormMeta>>
  ): FormInstance<TValues, CustomFormMeta>

  export function useFormContext<
    TValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  >(): FormInstance<TValues, CustomFormMeta>

  interface FieldMeta {
    error: ValidationError
    isTouched: boolean
    isValidating?: boolean
  }

  type SetValue<S> = S | ((prevState: S) => S)
  type SetFieldMeta<C> =
    | Partial<FieldMeta & C>
    | ((previousMeta: FieldMeta & C) => FieldMeta & C)

  interface FieldInstance<
    TValue,
    CustomFieldMeta,
    TFormValues,
    CustomFormMeta
  > {
    form: FormInstance<TFormValues, CustomFormMeta>
    fieldName: string
    value: TValue
    meta: FieldMeta & CustomFieldMeta
    FieldScope?: ComponentType<Provider<any>>
    debounce: Debounce
    runValidation: () => void
    getInputProps: (
      value?: Partial<HTMLProps<HTMLInputElement>> &
        Pick<HTMLProps<HTMLInputElement>, 'onSubmit'> &
        Pick<HTMLProps<HTMLInputElement>, 'onBlur'>
    ) => {
      value: TValue
      onChange: ChangeEventHandler<HTMLInputElement>
      onBlur: FocusEventHandler<HTMLInputElement>
    } & Partial<HTMLProps<HTMLInputElement>>
    setValue: (
      updater: SetValue<TValue>,
      options?: { isTouched: boolean }
    ) => void
    setMeta: (value: SetFieldMeta<CustomFieldMeta>) => void
    pushValue: (value: TValue extends (infer U)[] ? U : never) => void
    insertValue: (
      insertIndex: number,
      value: TValue extends (infer U)[] ? U : never
    ) => void
    removeValue: (removalIndex: number) => void
    swapValues: (firstIndex: number, secondIndex: number) => void
  }

  interface FieldOptions<TValue, CustomFieldMeta, TFormValues, CustomFormMeta> {
    defaultValue?: TValue
    defaultError?: ValidationError
    defaultIsTouched?: boolean
    defaultMeta?: FieldMeta & CustomFieldMeta
    validate?: (
      value: TValue,
      instance: FieldInstance<
        TValue,
        CustomFieldMeta,
        TFormValues,
        CustomFormMeta
      >
    ) => OptionalPromise<ValidatorReturn>
    filterValue?: (
      value: TValue,
      instance: FieldInstance<
        TValue,
        CustomFieldMeta,
        TFormValues,
        CustomFormMeta
      >
    ) => TValue
    validatePristine?: boolean
  }

  export function useField<
    TValue = Serializable,
    CustomFieldMeta extends {} = Record<string, any>,
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  >(
    fieldPath: string,
    options?: FieldOptions<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>
  ): FieldInstance<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>

  interface FieldOptionProps<
    TValue = Serializable,
    CustomFieldMeta extends {} = Record<string, any>,
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  > extends FieldOptions<TValue, CustomFieldMeta, TFormValues, CustomFormMeta> {
    onSubmit?: (
      value: TValue,
      instance: FormInstance<TFormValues, CustomFormMeta>
    ) => OptionalPromise<void>
    defaultValues?: TFormValues
    debugForm?: boolean
  }

  export function splitFormProps<
    P = {},
    TValue = Serializable,
    CustomFieldMeta extends {} = Record<string, any>,
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  >(
    props: FieldProps<TValue, CustomFieldMeta, TFormValues, CustomFormMeta> & P
  ): [
    typeof props['field'],
    FieldOptionProps<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>,
    P
  ]

  export interface FieldProps<
    TValue = Serializable,
    CustomFieldMeta extends {} = Record<string, any>,
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = Record<string, any>
  >
    extends FieldOptionProps<
      TValue,
      CustomFieldMeta,
      TFormValues,
      CustomFormMeta
    > {
    field: string
  }
}
