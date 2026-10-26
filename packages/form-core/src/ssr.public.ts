import { validateServerValues } from './ssr.lib'
import type { FormOptions } from './FormApi/formOptions.public'
import type {
  ServerFormState,
  ServerValidateFailure,
  ServerValidateSuccess,
} from './FormApi/formServerState.public'
import type { Awaitable } from './types.public'

/**
 * Connects a server framework's submission input and optional state storage to
 * `createServerValidateHelper`.
 *
 * Extract the submission here and leave conversion to a form's value shape to
 * its `decode` callback. This is usually `FormData`.
 *
 * @typeParam TInputData - The input accepted by the generated validation function.
 * Specify this when annotating a custom adapter's return type; it determines
 * the argument received by `getFormData`. Otherwise, the helper infers it from
 * that callback's parameter.
 * @typeParam TSubmissionData - The submission supplied to each form's `decode`
 * callback. When annotating an adapter, provide the value type returned by
 * `getFormData` after awaiting any promise. It need not be `FormData`. Without
 * an adapter annotation, the helper infers it from `getFormData`.
 */
export interface TanStackFormServerPlugin<TInputData, TSubmissionData> {
  /**
   * Extracts the submission from each validation call's input before its
   * form-specific `decode` callback runs. May be asynchronous.
   *
   * Return the input directly when it already has the format `decode` expects.
   *
   * Examples:
   * * TanStack Start: `({ formData }) => formData`, which is FormData.
   * * Next.JS: `formData => formData`, which is FormData.
   */
  getFormData: (input: TInputData) => Awaitable<TSubmissionData>
  /**
   * Stores failed validation state for later restoration on the client.
   * Providing this requires an explicit `formId` when creating each validator.
   *
   * Omit this when returning `result.serverState` directly to the client.
   * The helper writes failed state through `setState`; adapter or application
   * code is responsible for calling `readState` to retrieve it.
   */
  persistServerState?: {
    /**
     * Saves a failed validation result under the form options' `formId`.
     * The validator awaits this write before returning the failure result.
     * Successful validation does not write or clear stored state.
     *
     * Preserve the submitted values and validation results when serializing
     * the state so it can be supplied to the client form's `serverState` option.
     */
    setState: (
      formId: string,
      serverState: ServerFormState<unknown>,
    ) => Awaitable<void>
    /**
     * Retrieves saved state for a form, or `undefined` when none is available.
     * Supply the result to the client form's `serverState` option.
     *
     * The validation helper does not call this function. The adapter controls
     * whether reading also removes the stored state.
     *
     * @param formId - The same identifier used to persist the form's failed state.
     */
    readState: (
      formId: string,
    ) => Awaitable<ServerFormState<unknown> | undefined>
  }
}

/**
 * Supplies the conversion from an adapter's submission format to a form's values.
 *
 * @typeParam TSubmission - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface ServerValidateApiConfig<TSubmission, TFormData> {
  /**
   * Converts the extracted submission into the complete value shape inferred
   * from the form options, before server validation runs. May be asynchronous.
   *
   * A thrown error or rejected promise rejects the validation call instead of
   * returning a failed validation result or persisting state.
   */
  decode: (submission: TSubmission) => Awaitable<TFormData>
}

/**
 * A server validation factory bound to an adapter's input and submission formats.
 *
 * Pass form options and a decoder to obtain an async validator. Use
 * `createServerValidateHelper` to create this factory from a framework adapter.
 *
 * @typeParam TInput - Library-managed. Do not specify explicitly.
 * @typeParam TSubmission - Library-managed. Do not specify explicitly.
 */
export type ServerValidateApi<TInput, TSubmission> =
  /**
   * Creates a server validation function from shared form options and a
   * form-specific submission decoder.
   *
   * Each call to the generated function awaits input extraction, decoding, and
   * form validators configured with a `'server'` trigger. It does not call the
   * form's submission callbacks.
   *
   * Both success and failure results contain `serverState` for the client form.
   * Success also exposes the decoded `values` and `validatorOutputs` in validator
   * array order. Schema transformations appear in `validatorOutputs`, without
   * replacing `values`. Failure state is persisted, when configured, before the
   * promise resolves. Errors thrown during extraction, decoding, validation, or
   * persistence reject the promise instead of producing `success: false`.
   *
   * @param options - Shared form configuration. Requires `formId` when the adapter
   * provides `persistServerState`.
   * @param config - A decoder for this form's values; its output must match the
   * value shape inferred from `options`.
   * @returns An async validator that accepts the adapter's input. Check `success`
   * before accessing `values` or `validatorOutputs`.
   * @throws If persistence is enabled and `options.formId` is `undefined`.
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
   * @typeParam TValidators - Library-managed. Do not specify explicitly.
   * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
   */
  <
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
    config: ServerValidateApiConfig<TSubmission, NoInfer<TFormData>>,
  ) => (
    input: TInput,
  ) => Promise<
    | ServerValidateSuccess<TFormData, TValidators>
    | ServerValidateFailure<TFormData>
  >

/**
 * Selects the server framework adapter used to create validation functions.
 *
 * @typeParam TInput - Library-managed. Do not specify explicitly.
 * @typeParam TSubmission - Library-managed. Do not specify explicitly.
 */
export interface ServerValidateHelperArgs<TInput, TSubmission> {
  /** Extracts submissions from framework input and optionally stores failed state. */
  framework: TanStackFormServerPlugin<TInput, TSubmission>
}

/**
 * Creates a factory for server validation functions using a framework adapter.
 *
 * Reuse the factory across forms, supplying each form's options and decoder.
 * Custom adapters implement `TanStackFormServerPlugin`; the helper handles
 * decoding, server validation, and optional persistence of failed state.
 *
 * @param options - The adapter that extracts submissions and optionally persists
 * failed validation state.
 * @returns A factory that binds form options and a decoder to an async validator.
 * @typeParam TInput - Library-managed. Do not specify explicitly.
 * @typeParam TSubmission - Library-managed. Do not specify explicitly.
 */
export function createServerValidateHelper<TInput, TSubmission>(
  options: ServerValidateHelperArgs<TInput, TSubmission>,
): ServerValidateApi<TInput, TSubmission> {
  const { getFormData, persistServerState } = options.framework

  return (formOptions, { decode }) => {
    const formId = formOptions.formId

    if (persistServerState && formId === undefined) {
      throw new Error(
        'A formId is required when server state persistence is enabled',
      )
    }

    return async (input) => {
      const submission = await getFormData(input)
      const values = await decode(submission)
      const result = await validateServerValues(formOptions, values)

      if (!result.success) {
        if (persistServerState && formId !== undefined) {
          await persistServerState.setState(formId, result.serverState)
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
  }
}
