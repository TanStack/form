import {
  isStandardSchema,
  parseStandardSchema,
  parseStandardSchemaIssues,
} from '../standardSchema.lib'
import type { AnyInternalValidatorInstance } from '../ValidatorInstance.lib'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type {
  FieldValidateResult,
  FieldValidator,
  FieldValidatorContext,
  FormGroupValidateResult,
  FormGroupValidator,
  FormGroupValidatorContext,
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ServerFormValidatorContext,
  ValidationPredicateContext,
  ValidationTriggerOption,
  Validator,
} from '../validation.public'

type FormValidateContext = {
  scope: 'form'
  event: Exclude<FormValidatorContext<any>['event'], 'server'>
  signal: AbortSignal
  formApi: InternalFormApi<any, any, any>
  triggerFieldApi?: AnyInternalFieldApi
}
type ServerPipelineValidateContext = {
  scope: 'server'
  event: 'server'
  signal: AbortSignal
  formApi: undefined
}
type FieldValidateContext = Omit<
  FieldValidatorContext<any, any, any>,
  'value' | 'parseIssues'
> & { scope: 'field' }
type FormGroupValidateContext = Omit<
  FormGroupValidatorContext<any>,
  'value' | 'parseIssues' | 'createErrorMap'
> & { scope: 'group' }
export type FormInputContext = Omit<FormValidateContext, 'signal'>
type ServerFormInputContext = Omit<ServerPipelineValidateContext, 'signal'>
export type FieldInputContext = Omit<FieldValidateContext, 'signal'>
type FormGroupInputContext = Omit<FormGroupValidateContext, 'signal'>

export type InputContext =
  | FormInputContext
  | ServerFormInputContext
  | FieldInputContext
  | FormGroupInputContext
export type ValidateContext =
  | FormValidateContext
  | ServerPipelineValidateContext
  | FieldValidateContext
  | FormGroupValidateContext
export type ValidateResult =
  FormValidateResult<any> | FormGroupValidateResult<any> | FieldValidateResult
type AnyPipelineValidator =
  | FormValidator<any>
  | FormGroupValidator<any>
  | FieldValidator<any, any, any>
  | Validator<any, any, any, any>
export type AnyValidatorContext =
  | FormValidatorContext<any>
  | ServerFormValidatorContext<any>
  | FormGroupValidatorContext<any>
  | FieldValidatorContext<any, any, any>

function isServerContext(ctx: InputContext): ctx is ServerFormInputContext {
  return ctx.event === 'server'
}

/** Narrows an input context to a field-owned validation pipeline. */
function isFieldContext(ctx: InputContext): ctx is FieldInputContext {
  return ctx.scope === 'field'
}

/** Narrows an input context to a form-group-owned validation pipeline. */
function isGroupContext(ctx: InputContext): ctx is FormGroupInputContext {
  return ctx.scope === 'group'
}

/** Narrows an executing context to the server pipeline variant. */
export function isServerValidateContext(
  ctx: ValidateContext,
): ctx is ServerPipelineValidateContext {
  return ctx.event === 'server'
}

/** Narrows an executing context to the field pipeline variant. */
export function isFieldValidateContext(
  ctx: ValidateContext,
): ctx is FieldValidateContext {
  return ctx.scope === 'field'
}

/** Checks whether a configured trigger is the server-only trigger. */
function isServerTrigger(
  trigger: ValidationTriggerOption<any, any, any> | 'server',
): boolean {
  return trigger === 'server'
}

/** Checks whether a validator participates in server validation. */
function hasServerTrigger(validator: AnyPipelineValidator): boolean {
  return validator.triggers.some(isServerTrigger)
}

/**
 * Creates the scope-specific context passed to predicate and debounce callbacks.
 *
 * Values are read when the callback is evaluated so it observes the owning
 * form, group, or field's current state.
 */
function getPredicateContext(
  context: Exclude<InputContext, ServerFormInputContext>,
): ValidationPredicateContext<any, any> {
  if (isFieldContext(context)) {
    return {
      scope: 'field',
      formApi: context.formApi,
      fieldApi: context.fieldApi,
      value: context.fieldApi.value,
    }
  }

  if (isGroupContext(context)) {
    return {
      scope: 'group',
      formApi: context.formApi,
      fieldApi: context.triggerFieldApi,
      groupApi: context.groupApi,
      value: context.groupApi.value,
    }
  }

  return {
    scope: 'form',
    formApi: context.formApi,
    fieldApi: context.triggerFieldApi,
    value: context.formApi.state.values,
  }
}

/** Parses Standard Schema issues as errors owned directly by a field. */
export function parseFieldIssues(
  issues: Parameters<FieldValidatorContext<any, any, any>['parseIssues']>[0],
) {
  return parseStandardSchemaIssues(issues, undefined, 'field')
}

export const ABORTED_CALL = Symbol('ABORTED_CALL')
export const THROWN_ERROR = Symbol('THROWN_ERROR')

export type AbortedCall = typeof ABORTED_CALL
export type ThrownError = { [THROWN_ERROR]: true; error: unknown }
export interface ValidatorExecutionResult<in out TResult> {
  result: TResult
  schemaResult: any | null
  hasSchemaResult: boolean
}

interface PendingDebouncedCall<in out TResult extends ValidateResult> {
  context: ValidateContext
  resolve: (
    value: ValidatorExecutionResult<TResult> | AbortedCall | ThrownError,
  ) => void
  reject: (error: unknown) => void
}

type PipelineValidatorInstance<TResult extends ValidateResult> =
  AnyInternalValidatorInstance<(call: PendingDebouncedCall<TResult>) => void>

function getEnabledState(
  booleanOrFn: boolean | ((context: any) => boolean),
  context: InputContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn
  if (isServerContext(context)) return false

  return booleanOrFn(getPredicateContext(context))
}

/** Resolves a static delay or evaluates its callback outside server context. */
function getDebounceMs(
  numberOrFn: number | ((context: any) => number),
  context: InputContext,
): number {
  if (typeof numberOrFn === 'number') return numberOrFn
  if (isServerContext(context)) return 0

  return numberOrFn(getPredicateContext(context))
}

/**
 * Checks whether a trigger matches the current event and passes its condition.
 *
 * String triggers match directly. Object triggers additionally evaluate their
 * `when` predicate, which defaults to enabled.
 */
export function isValidationTriggerEnabled(
  trigger: ValidationTriggerOption<any, any, any> | 'server',
  context: InputContext,
): boolean {
  if (typeof trigger === 'string') {
    return trigger === context.event
  }

  if (trigger.trigger !== context.event) {
    return false
  }

  const { when: enabled = true } = trigger

  return getEnabledState(enabled, context)
}

/** Selects a validator using server, submit, or configured event semantics. */
export function shouldRunValidator(
  validator: AnyPipelineValidator,
  context: InputContext,
): boolean {
  if (isServerContext(context)) {
    return hasServerTrigger(validator)
  }

  const { runOnSubmit = true } = validator

  if (context.event === 'submit') {
    return getEnabledState(runOnSubmit, context)
  }

  return validator.triggers.some((signal) =>
    isValidationTriggerEnabled(signal, context),
  )
}

/**
 * Executes a validator and normalizes its result for pipeline processing.
 *
 * Standard Schema validators retain their parsed output and presence marker;
 * function validators produce only a validation result.
 */
export async function executeValidator<TResult extends ValidateResult>(
  validator: AnyPipelineValidator,
  context: AnyValidatorContext,
  scope: 'field' | 'form',
): Promise<ValidatorExecutionResult<TResult>> {
  if (isStandardSchema(validator.run)) {
    return parseStandardSchema(validator.run, context.value, scope) as never
  }

  return {
    result: (await validator.run(context)) as TResult,
    schemaResult: null,
    hasSchemaResult: false,
  }
}

interface RunMaybeDebouncedValidatorArgs<
  in out TResult extends ValidateResult,
> {
  validatorInstance: PipelineValidatorInstance<TResult>
  context: InputContext
  onExecute: (
    inputContext: ValidateContext,
  ) => Promise<ValidatorExecutionResult<TResult>>
}

/**
 * Creates a promise that resolves with the internal sentinel when aborted.
 *
 * Call `cleanup` after the race settles to release the signal listener.
 */
function createAbortPromise(signal: AbortSignal): {
  promise: Promise<AbortedCall>
  cleanup: () => void
} {
  let onAbort = () => {}

  const promise = new Promise<AbortedCall>((resolve) => {
    if (signal.aborted) {
      resolve(ABORTED_CALL)
      return
    }

    onAbort = () => {
      signal.removeEventListener('abort', onAbort)
      resolve(ABORTED_CALL)
    }

    signal.addEventListener('abort', onAbort)
  })

  return {
    promise,
    cleanup: () => {
      signal.removeEventListener('abort', onAbort)
    },
  }
}

/**
 * Races validator execution against its abort signal.
 *
 * Abortion suppresses the eventual execution result without requiring the
 * underlying validator promise to support cancellation.
 */
async function executeWithAbort<TResult extends ValidateResult>(
  context: ValidateContext,
  onExecute: (
    inputContext: ValidateContext,
  ) => Promise<ValidatorExecutionResult<TResult>>,
): Promise<ValidatorExecutionResult<TResult> | AbortedCall> {
  if (context.signal.aborted) {
    return ABORTED_CALL
  }

  const { promise: abortPromise, cleanup } = createAbortPromise(context.signal)

  try {
    return await Promise.race([
      Promise.resolve(onExecute(context)),
      abortPromise,
    ])
  } finally {
    cleanup()
  }
}

/** Resolves debounce duration, forcing immediate submit and server execution. */
function getValidatorDebounceMs(
  validator: AnyPipelineValidator,
  context: InputContext,
): number {
  if (context.event === 'submit' || context.event === 'server') return 0

  const { triggerDebounceMs = 0 } = validator

  return getDebounceMs(triggerDebounceMs, context)
}

/**
 * Installs the next abort controller on a stable validator instance.
 *
 * Installation aborts any previous execution. The returned cleanup clears the
 * controller only if it is still the instance's active controller.
 */
export function createValidatorAbortContext(
  validatorInstance: AnyInternalValidatorInstance,
  opts?: { cancelDebouncer?: boolean },
): {
  abortController: AbortController
  signal: AbortSignal
  cleanup: () => void
} {
  if (opts?.cancelDebouncer) {
    validatorInstance.debouncer?.cancel()
  }

  const abortController = new AbortController()
  const signal = abortController.signal

  validatorInstance.setAbortController(abortController)

  return {
    abortController,
    signal,
    cleanup: () => {
      validatorInstance.clearAbortController(abortController)
    },
  }
}

/**
 * Runs one validator immediately or through its instance-owned debouncer.
 *
 * Abort and thrown-error sentinels keep stale or exceptional executions out of
 * normal result processing. Every settlement releases its abort resources.
 */
export function runMaybeDebouncedValidator<TResult extends ValidateResult>({
  validatorInstance,
  context,
  onExecute,
}: RunMaybeDebouncedValidatorArgs<TResult>): Promise<
  ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
> {
  const validator = validatorInstance.definition
  const debounceMs = getValidatorDebounceMs(validator, context)

  const { signal, cleanup } = createValidatorAbortContext(validatorInstance)

  const validationContext: ValidateContext = {
    ...context,
    signal,
  }

  return new Promise<
    ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
  >((resolve) => {
    let settled = false

    const settle = (
      value: ValidatorExecutionResult<TResult> | AbortedCall | ThrownError,
    ) => {
      if (settled) return

      settled = true
      cleanupAbortListener()
      cleanup()
      resolve(value)
    }

    const fail = (error: unknown) => {
      if (settled) return

      console.error('Validator threw an error:', error)
      settle({ [THROWN_ERROR]: true, error })
    }

    const onAbort = () => {
      validatorInstance.debouncer?.cancel()
      settle(ABORTED_CALL)
    }

    const cleanupAbortListener = () => {
      signal.removeEventListener('abort', onAbort)
    }

    signal.addEventListener('abort', onAbort, { once: true })

    const run = (ctx: ValidateContext) => {
      executeWithAbort(ctx, onExecute).then(settle, fail)
    }

    if (debounceMs <= 0) {
      validatorInstance.debouncer?.cancel()
      run(validationContext)
      return
    }

    const debouncer = validatorInstance.getOrCreateDebouncer((call) => {
      executeWithAbort(call.context, onExecute).then(call.resolve, (error) => {
        console.error('Validator threw an error:', error)
        const thrownError: ThrownError = { [THROWN_ERROR]: true, error }
        call.resolve(thrownError)
      })
    }, debounceMs)

    if (!debouncer) {
      settle(ABORTED_CALL)
      return
    }

    debouncer.maybeExecute({
      context: validationContext,
      resolve: settle,
      // This should not be called anymore since we handle errors in the
      // debouncer callback.
      reject: () => {},
    })
  })
}
