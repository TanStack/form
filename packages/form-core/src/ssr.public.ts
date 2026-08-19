import type { FormOptions } from './FormApi/FormApi.public'
import type {
  FormValidateResultFromErrorTypes,
  FormValidators,
  ServerFormStandardSchemaValidatorOutputs,
  ToServerFormErrorTypes,
} from './validation.public'

export const initialServerFormState: ServerFormState<any, any> = {
  values: undefined,
  validationResults: [],
  submissionAttempts: 0,
}

type ServerValidateHelperResult<
  TFramework extends ServerValidateFrameworkPlugin,
> = Omit<TFramework, 'id'> & {
  initialServerFormState: ServerFormState<any, any>
}

export function serverValidateHelper<
  const TFramework extends ServerValidateFrameworkPlugin,
>(options: { framework: TFramework }): ServerValidateHelperResult<TFramework> {
  const { id: _unused, ...framework } = options.framework

  return {
    initialServerFormState,
    ...framework,
  }
}

interface ServerStateValidationResult<out TResult> {
  validatorIndex: number
  result: TResult
  schemaResult: unknown | null
  hasSchemaResult?: boolean
}

interface ServerFormStateByResult<in out TFormData, out TResult> {
  values: TFormData | undefined
  validationResults: Array<ServerStateValidationResult<TResult>>
  submissionAttempts: number
}

export type ServerFormState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = ServerFormStateByResult<
  TFormData,
  FormValidateResultFromErrorTypes<
    TFormData,
    ToServerFormErrorTypes<TFormValidators>
  >
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

type ServerValidateFrameworkCreateServerValidate = <
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
