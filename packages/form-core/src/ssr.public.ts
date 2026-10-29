import { validateServerValues } from './ssr.lib'
import type { FormOptions } from './FormApi/formOptions.public'
import type {
  ServerFormState,
  ServerValidateFailure,
  ServerValidateSuccess,
} from './FormApi/formServerState.public'
import type { Awaitable } from './types.public'

export interface TanStackFormServerPluginConfig<TSubmissionData> {
  submittedDataType: TSubmissionData
  transportMiddleware?: undefined
}

export interface TanstackFormTransportServerPluginConfig<TSubmissionData> {
  submittedDataType: TSubmissionData
  transportMiddleware: {
    setState: (
      transportId: string,
      serverState: ServerFormState<unknown>,
    ) => Awaitable<void>
    readState: (
      transportId: string,
    ) => Awaitable<ServerFormState<unknown> | undefined>
  }
}

type AnyConfig =
  | TanStackFormServerPluginConfig<any>
  | TanstackFormTransportServerPluginConfig<any>

export function createTanStackFormServerPlugin<TConfig extends AnyConfig>(
  config: TConfig,
): TConfig {
  return config
}

export interface ServerValidateApiConfig<TSubmissionData, TFormData> {
  decode: (submission: TSubmissionData) => Awaitable<TFormData>
}
export interface TransportServerValidateApiConfig<
  TSubmissionData,
  TFormData,
> extends ServerValidateApiConfig<TSubmissionData, TFormData> {
  transportId: string
}

export interface ServerValidatorData<TSubmissionData> {
  formData: TSubmissionData
}

export interface ServerValidator<TFormData, TValidators, TSubmissionData> {
  (
    input: ServerValidatorData<TSubmissionData>,
  ): Promise<
    | ServerValidateSuccess<TFormData, TValidators>
    | ServerValidateFailure<TFormData>
  >
}

export interface PersistedServerValidator<
  TFormData,
  TValidators,
  TSubmissionData,
> extends ServerValidator<TFormData, TValidators, TSubmissionData> {
  getServerState: () => Promise<ServerFormState<TFormData> | undefined>
  setServerState: (state: ServerFormState<TFormData>) => void
}

export type ServerValidateApi<TSubmissionData> = <
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
  config: ServerValidateApiConfig<TSubmissionData, NoInfer<TFormData>>,
) => ServerValidator<TFormData, TValidators, TSubmissionData>

export type TransportServerValidateApi<TSubmissionData> = <
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
  config: TransportServerValidateApiConfig<TSubmissionData, NoInfer<TFormData>>,
) => PersistedServerValidator<TFormData, TValidators, TSubmissionData>

export interface ServerValidateHelperArgs<TSubmissionData> {
  framework: TanStackFormServerPluginConfig<TSubmissionData>
}
export interface TransportServerValidateHelperArgs<TSubmissionData> {
  framework: TanstackFormTransportServerPluginConfig<TSubmissionData>
}

type MiddlewareApi =
  TanstackFormTransportServerPluginConfig<any>['transportMiddleware']

type ApiConfig<TSubmissionData> =
  | ServerValidateApiConfig<TSubmissionData, any>
  | TransportServerValidateApiConfig<TSubmissionData, any>

export function createServerValidateHelper<TSubmissionData>(
  options: TransportServerValidateHelperArgs<TSubmissionData>,
): TransportServerValidateApi<TSubmissionData>
export function createServerValidateHelper<TSubmissionData>(
  ptions: ServerValidateHelperArgs<TSubmissionData>,
): ServerValidateApi<TSubmissionData>
export function createServerValidateHelper<TSubmissionData>(
  options:
    | ServerValidateHelperArgs<TSubmissionData>
    | TransportServerValidateHelperArgs<TSubmissionData>,
):
  | ServerValidateApi<TSubmissionData>
  | TransportServerValidateApi<TSubmissionData> {
  let middleware: MiddlewareApi | undefined = undefined

  if ('transportMiddleware' in options.framework) {
    middleware = options.framework.transportMiddleware
  }

  return <
    TFormData,
    TValidatorConfig extends unknown[],
    TValidators,
    TSubmitReturn,
  >(
    formOptions: FormOptions<
      TFormData,
      TValidatorConfig,
      TValidators,
      TSubmitReturn,
      unknown
    >,
    config: ApiConfig<TSubmissionData>,
  ) => {
    let transportId: string | undefined = undefined
    if ('transportId' in config) {
      transportId = config.transportId
    }
    if (middleware && transportId === undefined) {
      throw new Error(
        'A formId is required when server state needs to be transported',
      )
    }

    const serverValidate = async (
      input: ServerValidatorData<TSubmissionData>,
    ) => {
      const values = await config.decode(input.formData)
      const result = await validateServerValues(formOptions, values)

      if (!result.success) {
        if (middleware && transportId !== undefined) {
          await middleware.setState(transportId, result.serverState)
        }

        return result
      }

      return {
        ...result,
        serverState: {
          values: result.values,
          validationResults: [],
          submissionAttempts: 1,
        },
      }
    }

    return Object.assign(serverValidate, {
      getServerState: () => {
        if (!middleware || transportId === undefined) {
          return undefined
        }

        return middleware.readState(transportId)
      },
      setServerState: (state: ServerFormState<any>) => {
        if (!middleware || transportId === undefined) return

        return middleware.setState(transportId, state)
      },
    })
  }
}
