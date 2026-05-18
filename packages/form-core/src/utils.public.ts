import type { FormOptions } from './FormApi.public'
import type {
  FormValidatorData,
  InferUnion,
  NullableSchemaData,
} from './utils.lib'
import type { FormValidators } from './validation.public'

export interface FormOptionsApi {
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): FormOptions<TFormData, TFormValidators, TSubmitReturn>

  schema: <
    const TFormValidators extends FormValidators<any>,
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => FormOptions<TFormData, TFormValidators, TSubmitReturn>

  nullableSchema: <
    const TFormValidators extends FormValidators<any>,
    const TFormData extends NullableSchemaData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => FormOptions<
    InferUnion<TFormData, FormValidatorData<TFormValidators>>,
    TFormValidators,
    TSubmitReturn
  >
}

const formOptions = ((opts) => {
  return opts
}) as FormOptionsApi

formOptions.schema = (opts) => opts
formOptions.nullableSchema = (opts) => opts as never

export { formOptions }
