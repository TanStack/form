import type { FormOptions } from './FormApi/FormApi.public'
import type {
  FormValidateResult,
  FormValidateResultFromMetas,
  FormValidators,
  ServerFormStandardSchemaValidatorOutputs,
  ToServerFormValidatorMetas,
} from './validation.public'

export {
  initialServerFormState,
  serverValidateHelper,
  validateServerValues,
} from './ssr.lib'

export type ServerFormValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = FormValidateResultFromMetas<
  TFormData,
  ToServerFormValidatorMetas<TFormValidators>
>

export interface ServerValidationResult<
  in out TFormData,
  TResult = FormValidateResult<TFormData>,
> {
  validatorIndex: number
  result: TResult
  schemaResult: unknown | null
  hasSchemaResult?: boolean
}

interface ServerFormStateByResult<in out TFormData, TResult> {
  values: TFormData | undefined
  validationResults: Array<ServerValidationResult<TFormData, TResult>>
  submissionAttempts: number
}

export type ServerFormState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = ServerFormStateByResult<
  TFormData,
  ServerFormValidateResult<TFormData, TFormValidators>
>

export interface ServerValidateSuccess<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
> {
  success: true
  values: TFormData
  schemaOutputs: ServerFormStandardSchemaValidatorOutputs<TFormValidators>
}

export interface ServerValidateFailure<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
> {
  success: false
  serverState: ServerFormState<TFormData, TFormValidators>
}

export type ServerValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> =
  | ServerValidateSuccess<TFormData, TFormValidators>
  | ServerValidateFailure<TFormData, TFormValidators>

interface ServerValidateErrorState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> {
  serverState: ServerFormState<TFormData, TFormValidators>
}

/**
 * @deprecated Server validation failures are returned as
 * `ServerValidateFailure` instead of being thrown.
 */
export class ServerValidateError<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
>
  extends Error
  implements ServerValidateErrorState<TFormData, TFormValidators>
{
  serverState: ServerFormState<TFormData, TFormValidators>

  constructor(options: ServerValidateErrorState<TFormData, TFormValidators>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.serverState = options.serverState
  }
}

export type ServerValidateRunner<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = (
  values: TFormData,
) => Promise<ServerValidateResult<TFormData, TFormValidators>>

export type ServerValidateFrameworkCreateServerValidate = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  pluginOptions?: any,
) => unknown

export interface ServerValidateFrameworkPlugin<
  TCreateServerValidate extends ServerValidateFrameworkCreateServerValidate =
    ServerValidateFrameworkCreateServerValidate,
> {
  id: `react-form-${string}`
  createServerValidate: TCreateServerValidate
}
