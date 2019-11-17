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

  export type SerializableObject = { [key: string]: Serializable }
  export interface SerializableArray extends Array<Serializable> {}
  export type Serializable =
    | string
    | number
    | boolean
    | null
    | SerializableObject
    | SerializableArray

  export type Debounce = <T>(fn: () => T, wait: number) => Promise<T>
  export type FieldValidator<
    TValue,
    Instance = FieldInstance<TValue, {}, {}, {}>
  > = (value: TValue, instance: Instance) => OptionalPromise<ValidatorReturn>
  export type ValidatorReturn = string | false | undefined
  export type OptionalPromise<T> = Promise<T> | T
  export type ValidationError = string | false | null | undefined

  export interface FormMeta {
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

  export type SetFormMeta<C> =
    | Partial<FormMeta & C>
    | ((previousMeta: FormMeta & C) => FormMeta & C)

  export interface FormInstance<TValues, CustomFormMeta> {
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

  export interface FormOptions<TValues, CustomFormMeta> {
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
    CustomFormMeta extends {} = {}
  >(
    options?: Partial<FormOptions<TValues, CustomFormMeta>>
  ): FormInstance<TValues, CustomFormMeta>

  export function useFormContext<
    TValues extends {} = SerializableObject,
    CustomFormMeta extends {} = {}
  >(): FormInstance<TValues, CustomFormMeta>

  export interface FieldMeta {
    error: ValidationError
    isTouched: boolean
    isValidating?: boolean
  }

  export type SetValue<S> = S | ((prevState: S) => S)
  export type SetFieldMeta<C> =
    | Partial<FieldMeta & C>
    | ((previousMeta: FieldMeta & C) => FieldMeta & C)

  export interface FieldInstance<
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

  export interface FieldOptions<
    TValue,
    CustomFieldMeta,
    TFormValues,
    CustomFormMeta
  > {
    defaultValue?: TValue
    defaultError?: ValidationError
    defaultIsTouched?: boolean
    defaultMeta?: FieldMeta & CustomFieldMeta
    validate?: FieldValidator<
      TValue,
      FieldInstance<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>
    >
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
    CustomFieldMeta extends {} = {},
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = {}
  >(
    fieldPath: string,
    options?: FieldOptions<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>
  ): FieldInstance<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>

  export interface FieldOptionProps<
    TValue = Serializable,
    CustomFieldMeta extends {} = {},
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = {}
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
    CustomFieldMeta extends {} = {},
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = {}
  >(
    props: FieldProps<TValue, CustomFieldMeta, TFormValues, CustomFormMeta> & P
  ): [
    typeof props['field'],
    FieldOptionProps<TValue, CustomFieldMeta, TFormValues, CustomFormMeta>,
    P
  ]

  export interface FieldProps<
    TValue = Serializable,
    CustomFieldMeta extends {} = {},
    TFormValues extends {} = SerializableObject,
    CustomFormMeta extends {} = {}
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
