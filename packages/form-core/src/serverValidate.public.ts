import { parseStandardSchemaIssues } from './standardSchema.lib'
import { createPipelineCache } from './utils.lib'
import { runValidatorPipeline } from './validation.lib'
import { createErrorMap } from './validation.public'
import type { FormOptions } from './FormApi/FormApi.public'
import type {
  FormValidateResult,
  FormValidators,
  ServerFormStandardSchemaValidatorOutputs,
  ToFormValidatorMetas,
} from './validation.public'

export interface ServerValidationResult<in out TFormData> {
  validatorIndex: number
  result: FormValidateResult<TFormData>
  schemaResult: unknown | null
  hasSchemaResult?: boolean
}

export interface ServerFormState<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
> {
  values: TFormData | undefined
  validationResults: Array<ServerValidationResult<TFormData>>
  submissionAttempts: number
  /**
   * @private
   * Carries validator type information without adding runtime data.
   */
  readonly _formValidatorMetas?: ToFormValidatorMetas<TFormValidators>
}

export interface ServerValidateSuccess<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
> {
  values: TFormData
  schemaOutputs: ServerFormStandardSchemaValidatorOutputs<TFormValidators>
}

interface ServerValidateErrorState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> {
  serverState: ServerFormState<TFormData, TFormValidators>
}

export class ServerValidateError<
    TFormData,
    TFormValidators extends FormValidators<TFormData>,
  >
  extends Error
  implements ServerValidateErrorState<TFormData, TFormValidators>
{
  serverState: ServerFormState<TFormData, TFormValidators>

  constructor(
    options: ServerValidateErrorState<TFormData, TFormValidators>,
  ) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.serverState = options.serverState
  }
}

export const initialServerFormState: ServerFormState<any, any> = {
  values: undefined,
  validationResults: [],
  submissionAttempts: 0,
}

export type ServerValidateRunner<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = (
  values: TFormData,
) => Promise<ServerValidateSuccess<TFormData, TFormValidators>>

export async function validateServerValues<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  values: TFormData,
): Promise<ServerValidateSuccess<TFormData, TFormValidators>> {
  const pipeline = options.validators
  const schemaOutputs: Array<unknown> = Array.from(
    { length: pipeline?.length ?? 0 },
    () => undefined,
  )

  if (!pipeline || pipeline.length === 0) {
    return {
      values,
      schemaOutputs: schemaOutputs as never,
    }
  }

  const pipelineResult = await runValidatorPipeline<
    FormValidateResult<TFormData>
  >({
    pipeline,
    cache: createPipelineCache(),
    context: {
      event: 'server',
      formApi: undefined,
    },
    hasFailedBefore: false,
    getContext: (ctx) => ({
      event: 'server',
      signal: ctx.signal,
      formApi: undefined,
      value: values,
      createErrorMap,
      parseIssues: (issues) =>
        parseStandardSchemaIssues(issues, values, 'form'),
    }),
    scope: 'form',
  })

  if (pipelineResult.thrownError !== null) {
    throw pipelineResult.thrownError
  }

  for (const result of pipelineResult.results) {
    if (result.hasSchemaResult) {
      schemaOutputs[result.validatorIndex] = result.schemaResult
    }
  }

  if (pipelineResult.hasErrors) {
    throw new ServerValidateError({
      serverState: {
        values,
        validationResults: pipelineResult.results,
        submissionAttempts: 1,
      },
    })
  }

  return {
    values,
    schemaOutputs: schemaOutputs as never,
  }
}

export type ServerValidateFrameworkCreateServerValidate = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => unknown

export interface ServerValidateFrameworkPlugin<
  TCreateServerValidate extends ServerValidateFrameworkCreateServerValidate =
    ServerValidateFrameworkCreateServerValidate,
> {
  id: `react-form-${string}`
  createServerValidate: TCreateServerValidate
}

export function serverValidateHelper<
  const TCreateServerValidate extends ServerValidateFrameworkCreateServerValidate,
>(options: {
  framework: ServerValidateFrameworkPlugin<TCreateServerValidate>
}): {
  initialServerFormState: ServerFormState<any, any>
  createServerValidate: TCreateServerValidate
} {
  return {
    initialServerFormState,
    createServerValidate: options.framework.createServerValidate,
  }
}
