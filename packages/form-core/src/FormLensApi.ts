import { standardSchemaValidators } from './standardSchemaValidator'
import { getBy } from './utils'
import type { Updater } from './utils'
import type { Derived, Store } from '@tanstack/store'
import type {
  BaseFormState,
  FormApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
} from './FormApi'
import type { AnyFieldMeta, AnyFieldMetaBase } from './FieldApi'
import type { DeepKeys, DeepKeysOfType, DeepValue } from './util-types'
import type {
  FormValidationErrorMap,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
} from './types'
import type { StandardSchemaV1 } from './standardSchemaValidator'

// What wasn't implemented from FormApi:
// - setErrorMap would require type-safe setting of the validators. Don't implement it.
// - resetFieldMeta would require you to pass the metas to the form instance. It's some work, but feel free to implement

/**
 * An object representing the options for a form.
 */
export interface FormLensOptions<
  in out TSubsetData,
  in out TFormData,
  in out TName extends DeepKeys<TFormData>,
  in out TOnMount extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChange extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  in out TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  in out TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TSubmitMeta = never,
> {
  form: FormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >
  name: TName
  /**
   * The expected subsetValues that the form must provide.
   */
  defaultValues?: TSubsetData
  /**
   * onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
   */
  onSubmitMeta?: TSubmitMeta
}

export class FormLensApi<
  in out TFormData,
  in out TLensData,
  in out TName extends DeepKeysOfType<TFormData, TLensData>,
  in out TOnMount extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChange extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  in out TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  in out TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TSubmitMeta = never,
> {
  private readonly formInstance: FormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >

  private readonly lensPrefix: TName

  /**
   * Get the true name of the field.
   * @private
   */
  getFormFieldName = <TField extends DeepKeys<TLensData>>(
    subfield: TField,
  ): DeepKeys<TFormData> => {
    // TODO find better solution to chaining names. This is prone to breaking if the syntax ever changes

    // If lensData is an array at top level, the name
    // would be [i].name
    // this would be incompatible with the form as it's expected
    // to receive lens.prefix[i].name and NOT lens.prefix.[i].name
    if (subfield.charAt(0) === '[') {
      return this.lensPrefix + subfield
    }
    return `${this.lensPrefix}.${subfield}`
  }

  /**
   * The name of this form lens.
   */
  get name(): string {
    return this.lensPrefix
  }

  /**
   * The options for the form.
   */
  get options(): FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  > {
    return this.formInstance.options
  }

  get baseStore(): Store<
    BaseFormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  > {
    return this.formInstance.baseStore
  }

  get fieldMetaDerived(): Derived<Record<string, AnyFieldMeta>> {
    return this.formInstance.fieldMetaDerived
  }

  get store(): Derived<
    FormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  > {
    return this.formInstance.store
  }

  // fieldInfo doesn't exist as it would require to know the path beforehand

  get state() {
    const { values, errors, ...rest } = this.store.state
    return {
      ...rest,
      errors: errors as unknown[],
      values: getBy(values, this.lensPrefix) as TLensData,
    }
  }

  /**
   * Constructs a new `FormApi` instance with the given form options.
   */
  constructor(
    opts: FormLensOptions<
      TLensData,
      TFormData,
      TName,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) {
    this.formInstance = opts.form
    this.lensPrefix = opts.name

    this.update = opts.form.update.bind(opts.form)
    this.validateAllFields = opts.form.validateAllFields.bind(opts.form)
    this.reset = opts.form.reset.bind(opts.form)
  }

  /**
   * Updates the form options and form state.
   */
  update: (
    options?: FormOptions<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) => void

  /**
   * Resets the form state to the default values.
   * Values cannot be provided as the parent data is not known.
   */
  reset: () => void

  /**
   * Validates all fields using the correct handlers for a given validation cause.
   */
  validateAllFields: (cause: ValidationCause) => Promise<unknown[]>

  /**
   * Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.
   */
  validateArrayFieldsStartingFrom = async <TField extends DeepKeys<TLensData>>(
    field: TField,
    index: number,
    cause: ValidationCause,
  ) => {
    this.formInstance.validateArrayFieldsStartingFrom(
      this.getFormFieldName(field),
      index,
      cause,
    )
  }

  /**
   * Validates a specified field in the form using the correct handlers for a given validation type.
   */
  validateField = <TField extends DeepKeys<TLensData>>(
    field: TField,
    cause: ValidationCause,
  ) => {
    this.formInstance.validateField(this.getFormFieldName(field), cause)
  }

  /**
   * Handles the form submission, performs validation, and calls the appropriate onSubmit or onSubmitInvalid callbacks.
   */
  handleSubmit(): Promise<void>
  handleSubmit(submitMeta: TSubmitMeta): Promise<void>
  async handleSubmit(submitMeta?: TSubmitMeta): Promise<void> {
    // cast is required since the implementation isn't one of the two overloads
    return this.formInstance.handleSubmit(submitMeta as any)
  }

  /**
   * Gets the value of the specified field.
   */
  getFieldValue = <TField extends DeepKeys<TLensData>>(
    field: TField,
  ): DeepValue<TLensData, TField> => {
    return this.formInstance.getFieldValue(
      this.getFormFieldName(field),
    ) as DeepValue<TLensData, TField>
  }

  /**
   * Gets the metadata of the specified field.
   */
  getFieldMeta = <TField extends DeepKeys<TLensData>>(field: TField) => {
    return this.formInstance.getFieldMeta(this.getFormFieldName(field))
  }

  /**
   * Gets the field info of the specified field.
   */
  getFieldInfo = <TField extends DeepKeys<TLensData>>(field: TField) => {
    return this.formInstance.getFieldInfo(this.getFormFieldName(field))
  }

  /**
   * Updates the metadata of the specified field.
   */
  setFieldMeta = <TField extends DeepKeys<TLensData>>(
    field: TField,
    updater: Updater<AnyFieldMetaBase>,
  ) => {
    return this.formInstance.setFieldMeta(this.getFormFieldName(field), updater)
  }

  /**
   * Sets the value of the specified field and optionally updates the touched state.
   */
  setFieldValue = <TField extends DeepKeys<TLensData>>(
    field: TField,
    updater: Updater<DeepValue<TLensData, TField>>,
    opts?: UpdateMetaOptions,
  ) => {
    console.log(this.getFormFieldName(field))
    return this.formInstance.setFieldValue(
      this.getFormFieldName(field) as never,
      updater as never,
      opts,
    )
  }

  /**
   * Delete a field and its subfields.
   */
  deleteField = <TField extends DeepKeys<TLensData>>(field: TField) => {
    return this.formInstance.deleteField(this.getFormFieldName(field))
  }

  /**
   * Pushes a value into an array field.
   */
  pushFieldValue = <TField extends DeepKeys<TLensData>>(
    field: TField,
    value: DeepValue<TLensData, TField> extends any[]
      ? DeepValue<TLensData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.pushFieldValue(
      this.getFormFieldName(field),
      // since unknown doesn't extend an array, it types `value` as never.
      value as never,
      opts,
    )
  }

  /**
   * Insert a value into an array field at the specified index.
   */
  insertFieldValue = async <TField extends DeepKeys<TLensData>>(
    field: TField,
    index: number,
    value: DeepValue<TLensData, TField> extends any[]
      ? DeepValue<TLensData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.insertFieldValue(
      this.getFormFieldName(field),
      index,
      // since unknown doesn't extend an array, it types `value` as never.
      value as never,
      opts,
    )
  }

  /**
   * Replaces a value into an array field at the specified index.
   */
  replaceFieldValue = async <TField extends DeepKeys<TLensData>>(
    field: TField,
    index: number,
    value: DeepValue<TLensData, TField> extends any[]
      ? DeepValue<TLensData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.replaceFieldValue(
      this.getFormFieldName(field),
      index,
      // since unknown doesn't extend an array, it types `value` as never.
      value as never,
      opts,
    )
  }

  /**
   * Removes a value from an array field at the specified index.
   */
  removeFieldValue = async <TField extends DeepKeys<TLensData>>(
    field: TField,
    index: number,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.removeFieldValue(
      this.getFormFieldName(field),
      index,
      opts,
    )
  }

  /**
   * Swaps the values at the specified indices within an array field.
   */
  swapFieldValues = <TField extends DeepKeys<TLensData>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.swapFieldValues(
      this.getFormFieldName(field),
      index1,
      index2,
      opts,
    )
  }

  /**
   * Moves the value at the first specified index to the second specified index within an array field.
   */
  moveFieldValues = <TField extends DeepKeys<TLensData>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => {
    return this.formInstance.moveFieldValues(
      this.getFormFieldName(field),
      index1,
      index2,
      opts,
    )
  }

  /**
   * Resets the field value and meta to default state
   */
  resetField = <TField extends DeepKeys<TLensData>>(field: TField) => {
    return this.formInstance.resetField(this.getFormFieldName(field))
  }

  /**
   * Returns form, lens and field level errors
   */
  getAllErrors = (): {
    form: {
      errors: unknown[]
      errorMap: FormValidationErrorMap
    }
    lens: {
      errors: ValidationError[]
      errorMap: FormValidationErrorMap
    }
    fields: Record<
      DeepKeys<TLensData>,
      { errors: ValidationError[]; errorMap: ValidationErrorMap }
    >
  } => {
    const allErrors = this.formInstance.getAllErrors()
    return {
      form: allErrors.form,
      ...Object.entries(
        allErrors.fields as Record<
          string,
          {
            errors: ValidationError[]
            errorMap: ValidationErrorMap
          }
        >,
      ).reduce<{
        lens: {
          errors: ValidationError[]
          errorMap: FormValidationErrorMap
        }
        fields: Record<
          DeepKeys<TLensData>,
          { errors: ValidationError[]; errorMap: ValidationErrorMap }
        >
      }>(
        (data, [fieldName, errorData]) => {
          // the field is unrelated to this lens
          if (!fieldName.startsWith(this.lensPrefix)) {
            return data
          }
          // the field error is at the top level of the lens
          if (fieldName === this.lensPrefix) {
            data.lens = errorData
            return data
          }
          // the field error is a subfield of the lens
          let newFieldName = fieldName.replace(
            this.lensPrefix,
            '',
          ) as DeepKeys<TLensData>
          if (newFieldName.startsWith('.')) {
            newFieldName = newFieldName.slice(1)
          }
          data.fields[newFieldName] = errorData
          return data
        },
        {
          lens: {
            errors: [],
            errorMap: {},
          },
          fields: {} as Record<
            DeepKeys<TLensData>,
            { errors: ValidationError[]; errorMap: ValidationErrorMap }
          >,
        },
      ),
    }
  }

  /**
   * Parses the lens values with a given standard schema and returns
   * issues (if any). This method does NOT set any internal errors.
   * @param schema The standard schema to parse the lens values with.
   */
  parseValuesWithSchema = (schema: StandardSchemaV1<TLensData, unknown>) => {
    return standardSchemaValidators.validate(
      { value: this.state.values, validationSource: 'field' },
      schema,
    )
  }

  /**
   * Parses the lens values with a given standard schema and returns
   * issues (if any). This method does NOT set any internal errors.
   * @param schema The standard schema to parse the lens values with.
   */
  parseValuesWithSchemaAsync = (
    schema: StandardSchemaV1<TLensData, unknown>,
  ) => {
    return standardSchemaValidators.validateAsync(
      { value: this.state.values, validationSource: 'field' },
      schema,
    )
  }
}
