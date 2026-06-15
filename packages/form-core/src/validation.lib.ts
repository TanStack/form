import { LiteDebouncer } from '@tanstack/pacer-lite'
import {
  isStandardSchema,
  parseStandardSchema,
  parseStandardSchemaIssues,
} from './standardSchema.lib'
import {
  evaluate,
  isNil,
  isNotNil,
  isPromiseLike,
  normalizeToArray,
} from './utils.lib'
import type { PipelineCache } from './utils.lib'
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
  ValidationAggregateError,
  ValidationDebounceFn,
  ValidationErrorInput,
  ValidationIssue,
  ValidationPredicateFn,
  ValidationTriggerOption,
  Validator,
} from './validation.public'
import type { InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { InternalFormGroupApi } from './FormGroupApi/FormGroupApi.lib'

type FormValidateContext = Omit<
  FormValidatorContext<any>,
  'value' | 'parseIssues'
>
type FieldValidateContext = Omit<
  FieldValidatorContext<any, any, any>,
  'value' | 'parseIssues'
>
type FormGroupValidateContext = Omit<
  FormGroupValidatorContext<any>,
  'value' | 'parseIssues'
>
type FormInputContext = Omit<FormValidateContext, 'signal'>
type FieldInputContext = Omit<FieldValidateContext, 'signal'>
type FormGroupInputContext = Omit<FormGroupValidateContext, 'signal'>

export type InputContext =
  | FormInputContext
  | FieldInputContext
  | FormGroupInputContext
export type ValidateContext =
  | FormValidateContext
  | FieldValidateContext
  | FormGroupValidateContext
type ValidateResult =
  | FormValidateResult<any>
  | FormGroupValidateResult<any>
  | FieldValidateResult

type MountValidationExecutionResult<in out TResult extends ValidateResult> = {
  result: TResult
  schemaResult: any | null
  hasSchemaResult: boolean
}

function isFormContext(ctx: InputContext): ctx is FormInputContext {
  return 'triggerFieldApi' in ctx
}

function getContextValue(context: InputContext) {
  return isFormContext(context)
    ? context.formApi.state.values
    : context.fieldApi.value
}

function parseFieldIssues(
  issues: Parameters<
    FieldValidatorContext<any, any, any>['parseIssues']
  >[0],
) {
  return parseStandardSchemaIssues(issues, undefined, 'field')
}

const ABORTED_CALL = Symbol('ABORTED_CALL')
const THROWN_ERROR = Symbol('THROWN_ERROR')

type AbortedCall = typeof ABORTED_CALL
type ThrownError = { [THROWN_ERROR]: true; error: unknown }

/**
 * @private
 * Check if a validation result is considered an error.
 */
export function isErrorResult<T extends ValidateResult>(
  value: T,
): value is Exclude<T, null | undefined | false> {
  if (isNil(value) || value === false) return false
  return true
}

export function normalizeValidationError(
  value: ValidationErrorInput | null | undefined,
): Array<ValidationIssue> {
  return normalizeToArray(value).map((error) =>
    typeof error === 'string' ? { message: error } : error,
  )
}

export function hasIndexedErrorFromSource(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  index: number,
  sourceEvent: string,
): boolean {
  const error = errors[index]
  if (!error) return false
  if (error.length === 0) return false
  if (errorSourceEvents[index] !== sourceEvent) return false
  return true
}

export function hasIndexedErrors(
  errors: Array<Array<ValidationIssue>>,
): boolean {
  return errors.some((validatorErrors) => validatorErrors.length > 0)
}

export function setIndexedError(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  index: number,
  error: Array<ValidationIssue>,
  sourceEvent: string,
): {
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
} | null {
  const nextSourceEvent = error.length > 0 ? sourceEvent : null
  const prevError = errors[index] ?? []

  if (
    evaluate(prevError, error) &&
    errorSourceEvents[index] === nextSourceEvent
  ) {
    return null
  }

  const nextLength = Math.max(
    errors.length,
    errorSourceEvents.length,
    index + 1,
  )
  const nextErrors = Array.from(
    { length: nextLength },
    (_, errorIndex) => errors[errorIndex] ?? [],
  )
  const nextErrorSourceEvents = Array.from(
    { length: nextLength },
    (_, errorIndex) => errorSourceEvents[errorIndex] ?? null,
  )
  nextErrors[index] = error
  nextErrorSourceEvents[index] = nextSourceEvent

  return {
    errors: nextErrors,
    errorSourceEvents: nextErrorSourceEvents,
  }
}

export function clearIndexedErrorsFromSource(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  indexes: Array<number>,
  sourceEvent: string,
): {
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
} | null {
  let nextErrors: Array<Array<ValidationIssue>> | null = null
  let nextErrorSourceEvents: Array<string | null> | null = null

  for (const index of indexes) {
    if (
      hasIndexedErrorFromSource(errors, errorSourceEvents, index, sourceEvent)
    ) {
      nextErrors ??= errors.slice()
      nextErrorSourceEvents ??= errorSourceEvents.slice()
      nextErrors[index] = []
      nextErrorSourceEvents[index] = null
    }
  }

  if (!nextErrors || !nextErrorSourceEvents) return null

  return {
    errors: nextErrors,
    errorSourceEvents: nextErrorSourceEvents,
  }
}

export function reconcileRoutedFieldErrors(
  validatorIndex: number,
  fieldErrors: Iterable<readonly [string, Array<ValidationIssue>]>,
  oldFieldRefs: Set<AnyInternalFieldApi> | undefined,
  getField: (fieldName: string) => AnyInternalFieldApi,
  setFieldError: (
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
  ) => void,
  clearFieldError: (field: AnyInternalFieldApi, validatorIndex: number) => void,
): {
  fieldRefs: Set<AnyInternalFieldApi>
  affectedFields: Set<AnyInternalFieldApi>
  didFieldRefsChange: boolean
} {
  const staleFieldRefs = oldFieldRefs ? new Set(oldFieldRefs) : undefined
  const affectedFields = new Set<AnyInternalFieldApi>()
  const newFieldRefs = new Set<AnyInternalFieldApi>()

  for (const [fieldName, fieldError] of fieldErrors) {
    const field = getField(fieldName)
    setFieldError(field, validatorIndex, fieldError)
    newFieldRefs.add(field)
    affectedFields.add(field)
    staleFieldRefs?.delete(field)
  }

  if (staleFieldRefs) {
    for (const field of staleFieldRefs) {
      clearFieldError(field, validatorIndex)
      affectedFields.add(field)
    }
  }

  return {
    fieldRefs: newFieldRefs,
    affectedFields,
    didFieldRefsChange:
      newFieldRefs.size > 0 ||
      (oldFieldRefs !== undefined && oldFieldRefs.size > 0),
  }
}

/**
 * Check if a validation result is a ValidationAggregateError.
 * If it is, return an object with formError and fieldErrors.
 * Otherwise, return null.
 */
export function isAggregateError(value: FormValidateResult<any>): {
  formError: ValidationErrorInput | null
  fieldErrors: ValidationAggregateError<any>['fields']
} | null {
  if (!isErrorResult(value)) return null

  const aggregateError = value

  // A ValidationAggregateError must be an object with at least one of form or fields
  if (typeof aggregateError === 'object' && !Array.isArray(aggregateError)) {
    if ('fields' in aggregateError) {
      return {
        formError: aggregateError.form ?? null,
        fieldErrors: aggregateError.fields,
      }
    }
  }

  return null
}

export interface PipelineResult<in out T> {
  validatorIndex: number
  result: T
  schemaResult: any | null
  hasSchemaResult?: boolean
}

interface ValidatorExecutionResult<in out TResult> {
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

export type ValidationDebouncer<TResult extends ValidateResult> = LiteDebouncer<
  (call: PendingDebouncedCall<TResult>) => void
>

interface PendingPipelineResult<in out T> {
  validatorIndex: number
  result: T
}

function getEnabledState(
  booleanOrFn: boolean | ValidationPredicateFn<any, any>,
  context: InputContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn

  return booleanOrFn({
    triggerFieldApi: isFormContext(context)
      ? context.triggerFieldApi
      : context.fieldApi,
    formApi: context.formApi,
    value: getContextValue(context),
  })
}

function getDebounceMs(
  numberOrFn: number | ValidationDebounceFn<any, any>,
  context: InputContext,
): number {
  if (typeof numberOrFn === 'number') return numberOrFn

  return numberOrFn({
    triggerFieldApi: isFormContext(context)
      ? context.triggerFieldApi
      : context.fieldApi,
    formApi: context.formApi,
    value: getContextValue(context),
  })
}

export function isValidationTriggerEnabled(
  trigger: ValidationTriggerOption<any, any>,
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

function shouldRunValidator(
  validator: Validator<any, any, any>,
  context: InputContext,
): boolean {
  const { runOnSubmit = true } = validator

  if (context.event === 'submit') {
    return getEnabledState(runOnSubmit, context)
  }

  return validator.triggers.some((signal) =>
    isValidationTriggerEnabled(signal, context),
  )
}

async function executeValidator<TResult extends ValidateResult>(
  validator: Validator<any, any, any>,
  context:
    | FormValidatorContext<any>
    | FormGroupValidatorContext<any>
    | FieldValidatorContext<any, any, any>,
  scope: 'field' | 'form',
): Promise<ValidatorExecutionResult<TResult>> {
  if (isStandardSchema(validator.run)) {
    return parseStandardSchema(validator.run, context.value, scope) as never
  }

  return {
    result: await validator.run(context),
    schemaResult: null,
    hasSchemaResult: false,
  }
}

interface ValidatorPipelineArgs<in out TResult extends ValidateResult> {
  context: InputContext
  cache: PipelineCache<TResult>
  pipeline: ReadonlyArray<Validator<any, any, any>>
  hasFailedBefore: boolean
  getContext: (
    inputContext: ValidateContext,
  ) =>
    | FieldValidatorContext<any, any, any>
    | FormGroupValidatorContext<any>
    | FormValidatorContext<any>
  scope: 'field' | 'form'
  validatorIndecesToRun?: Array<number> | null
  onResult?: (result: PipelineResult<TResult>) => void
}

interface RunMaybeDebouncedValidatorArgs<
  in out TResult extends ValidateResult,
> {
  validator: Validator<any, any, any>
  context: InputContext
  validatorIndex: number
  cache: PipelineCache<TResult>
  onExecute: (
    inputContext: ValidateContext,
  ) => Promise<ValidatorExecutionResult<TResult>>
}

function clearAbortController<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  cacheKey: number,
  abortController: AbortController,
): void {
  if (cache.validatorAbortControllers.get(cacheKey) === abortController) {
    cache.validatorAbortControllers.delete(cacheKey)
  }
}

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

function getValidatorDebounceMs(
  validator: Validator<any, any, any>,
  context: InputContext,
): number {
  if (context.event === 'submit') return 0

  const { triggerDebounceMs = 0 } = validator

  return getDebounceMs(triggerDebounceMs, context)
}

function abortPreviousValidatorRun<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  cacheKey: number,
): void {
  // AbortControllers are scoped to the validator instead of the whole pipeline.
  // Mostly because different validators can have different debounces and they
  // can be triggered by unrelated validation signals
  cache.validatorAbortControllers.get(cacheKey)?.abort()
}

function createValidatorAbortContext<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  cacheKey: number,
  opts?: { cancelDebouncer?: boolean },
): {
  abortController: AbortController
  signal: AbortSignal
  cleanup: () => void
} {
  abortPreviousValidatorRun(cache, cacheKey)

  if (opts?.cancelDebouncer) {
    cache.validatorDebouncers.get(cacheKey)?.cancel()
  }

  const abortController = new AbortController()
  const signal = abortController.signal

  cache.validatorAbortControllers.set(cacheKey, abortController)

  return {
    abortController,
    signal,
    cleanup: () => {
      clearAbortController(cache, cacheKey, abortController)
    },
  }
}

function getOrCreateDebouncer<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  cacheKey: number,
  fn: (call: PendingDebouncedCall<TResult>) => void,
  wait: number,
): ValidationDebouncer<TResult> {
  let debouncer = cache.validatorDebouncers.get(cacheKey)

  if (!debouncer) {
    debouncer = new LiteDebouncer(fn, {
      wait,
    })

    cache.validatorDebouncers.set(cacheKey, debouncer)
  } else {
    debouncer.fn = fn
    debouncer.options.wait = wait
  }

  return debouncer
}

function runMaybeDebouncedValidator<TResult extends ValidateResult>({
  validator,
  context,
  validatorIndex,
  cache,
  onExecute,
}: RunMaybeDebouncedValidatorArgs<TResult>): Promise<
  ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
> {
  const cacheKey = validatorIndex
  const debounceMs = getValidatorDebounceMs(validator, context)

  const { signal, cleanup } = createValidatorAbortContext(cache, cacheKey)

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
      cache.validatorDebouncers.get(cacheKey)?.cancel()
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
      cache.validatorDebouncers.get(cacheKey)?.cancel()
      run(validationContext)
      return
    }

    const debouncer = getOrCreateDebouncer(
      cache,
      cacheKey,
      (call) => {
        executeWithAbort(call.context, onExecute).then(
          call.resolve,
          (error) => {
            console.error('Validator threw an error:', error)
            const thrownError: ThrownError = { [THROWN_ERROR]: true, error }
            call.resolve(thrownError)
          },
        )
      },
      debounceMs,
    )

    debouncer.maybeExecute({
      context: validationContext,
      resolve: settle,
      // This should not be called anymore since we handle errors in the
      // debouncer callback.
      reject: () => {},
    })
  })
}

type PendingPromises<TResult> = Array<
  Promise<
    PendingPipelineResult<
      ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
    >
  >
>

async function flushPendingResults<TResult extends ValidateResult>(
  pending: PendingPromises<TResult>,
  results: Array<PipelineResult<TResult>>,
  onResult?: (result: PipelineResult<TResult>) => void,
): Promise<{ hasErrors: boolean; thrownError: unknown | null }> {
  let hasErrors = false
  let thrownError: unknown | null = null

  await Promise.all(
    pending.map(async (promise) => {
      const result = await promise

      const executionResult = result.result

      if (executionResult === ABORTED_CALL) {
        return
      }

      // Check if this is a thrown error from a validator
      if (
        isNotNil(executionResult) &&
        typeof executionResult === 'object' &&
        THROWN_ERROR in executionResult
      ) {
        thrownError = executionResult.error
        return
      }

      if (isErrorResult(executionResult.result)) {
        hasErrors = true
      }

      const publicResult: PipelineResult<TResult> = {
        validatorIndex: result.validatorIndex,
        result: executionResult.result,
        schemaResult: executionResult.schemaResult,
        hasSchemaResult: executionResult.hasSchemaResult,
      }

      results[result.validatorIndex] = publicResult
      onResult?.(publicResult)
    }),
  )

  return { hasErrors, thrownError }
}

export async function runValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  context,
  cache,
  hasFailedBefore = false,
  getContext,
  onResult,
  scope,
  validatorIndecesToRun = null,
}: ValidatorPipelineArgs<TResult>): Promise<{
  results: Array<PipelineResult<TResult>>
  hasErrors: boolean
  thrownError: unknown | null
}> {
  let pending: PendingPromises<TResult> = []
  const results: Array<PipelineResult<TResult>> = []

  let hasErrors = hasFailedBefore
  let thrownError: unknown | null = null

  const flush = async (): Promise<void> => {
    const { hasErrors: didError, thrownError: flushedThrownError } =
      await flushPendingResults(pending, results, onResult)

    pending = []
    hasErrors ||= didError
    if (flushedThrownError !== null) {
      thrownError = flushedThrownError
    }
  }

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    if (validatorIndecesToRun && !validatorIndecesToRun.includes(i)) {
      continue
    }

    if (!shouldRunValidator(validator, context)) {
      continue
    }

    if (validator.bailIfInvalid) {
      await flush()

      if (hasErrors || thrownError !== null) {
        break
      }
    }

    const promise = runMaybeDebouncedValidator<TResult>({
      validator,
      context,
      validatorIndex: i,
      cache,
      onExecute: (ctx) => {
        return executeValidator<TResult>(validator, getContext(ctx), scope)
      },
    }).then<
      PendingPipelineResult<
        ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
      >
    >((result) => ({
      validatorIndex: i,
      result,
    }))

    pending.push(promise)
  }

  await flush()

  return {
    // Shouldn't happen, but in case we have sparse arrays
    results: results.filter(Boolean),
    hasErrors,
    thrownError,
  }
}

interface FormValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormValidator<any>>
  context: FormInputContext
  /**
   * @private
   * Whether previous pipelines have reported an error or not.
   */
  hasFailedBefore: boolean
  onResult?: (result: PipelineResult<FormValidateResult<any>>) => void
}

export interface FormValidatorPipelineResult {
  results: Array<PipelineResult<FormValidateResult<any>>>
  hasErrors: boolean
  thrownError: unknown | null
}

export function runFormValidatorPipeline({
  pipeline,
  context,
  onResult,
  hasFailedBefore,
}: FormValidatorPipelineArgs): Promise<FormValidatorPipelineResult> {
  const cache = (context.formApi as InternalFormApi<any, any, any>)
    ._pipelineCache

  return runValidatorPipeline<FormValidateResult<any>>({
    pipeline,
    context,
    onResult,
    cache,
    hasFailedBefore,
    getContext: (ctx) => {
      if (isFormContext(ctx)) {
        return {
          event: ctx.event,
          triggerFieldApi: ctx.triggerFieldApi,
          formApi: ctx.formApi,
          signal: ctx.signal,
          value: ctx.formApi.state.values,
          parseIssues: (issues) =>
            parseStandardSchemaIssues(
              issues,
              ctx.formApi.state.values,
              'form',
            ),
        }
      }
      return {
        event: ctx.event,
        fieldApi: ctx.fieldApi,
        formApi: ctx.formApi,
        signal: ctx.signal,
        value: ctx.formApi.state.values,
        parseIssues: (issues) =>
          parseStandardSchemaIssues(issues, ctx.formApi.state.values, 'form'),
      }
    },
    scope: 'form',
  })
}

interface FormMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormValidator<any>>
  formApi: InternalFormApi<any, any, any>
  onResult?: (result: PipelineResult<FormValidateResult<any>>) => void
}

export interface FormMountValidatorPipelineResult {
  didRun: boolean
  asyncPromise: Promise<void> | null
}

interface MountValidatorPipelineArgs<in out TResult extends ValidateResult> {
  pipeline: ReadonlyArray<Validator<any, any, any>>
  cache: PipelineCache<TResult>
  getContext: (
    signal: AbortSignal,
  ) =>
    | FormValidatorContext<any>
    | FormGroupValidatorContext<any>
    | FieldValidatorContext<any, any, any>
  scope: 'field' | 'form'
  onResult?: (result: PipelineResult<TResult>) => void
}

function createEmptyMountValidationResult<
  TResult extends ValidateResult,
>(): MountValidationExecutionResult<TResult> {
  return {
    result: null as TResult,
    schemaResult: null,
    hasSchemaResult: false,
  }
}

function processMountValidationExecutionResult<TResult extends ValidateResult>(
  validatorIndex: number,
  executionResult: MountValidationExecutionResult<TResult>,
  onResult?: (result: PipelineResult<TResult>) => void,
): boolean {
  const result: PipelineResult<TResult> = {
    validatorIndex,
    result: executionResult.result,
    schemaResult: executionResult.schemaResult,
    hasSchemaResult: executionResult.hasSchemaResult,
  }

  onResult?.(result)

  return isErrorResult(executionResult.result)
}

function executeMountValidator<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  getContext: MountValidatorPipelineArgs<TResult>['getContext'],
  scope: 'field' | 'form',
  validator: Validator<any, any, any>,
  validatorIndex: number,
):
  | MountValidationExecutionResult<TResult>
  | PromiseLike<MountValidationExecutionResult<TResult>> {
  const { signal, cleanup } = createValidatorAbortContext(
    cache,
    validatorIndex,
    { cancelDebouncer: true },
  )

  const context = getContext(signal)

  try {
    if (isStandardSchema(validator.run)) {
      return parseStandardSchema(validator.run, context.value, scope)
        .then((result) => {
          if (signal.aborted) {
            return createEmptyMountValidationResult<TResult>()
          }

          return result
        })
        .finally(cleanup) as unknown as PromiseLike<
        MountValidationExecutionResult<TResult>
      >
    }

    const result = validator.run(context)

    if (isPromiseLike(result)) {
      return Promise.resolve(result)
        .then((asyncResult): MountValidationExecutionResult<TResult> => {
          if (signal.aborted) {
            return createEmptyMountValidationResult<TResult>()
          }

          return {
            result: asyncResult as TResult,
            schemaResult: null,
            hasSchemaResult: false,
          }
        })
        .finally(cleanup)
    }

    cleanup()
    return {
      result: result as TResult,
      schemaResult: null,
      hasSchemaResult: false,
    }
  } catch (error) {
    cleanup()
    console.error(error)
    return createEmptyMountValidationResult<TResult>()
  }
}

async function continueMountValidationFromAsyncResult<
  TResult extends ValidateResult,
>(
  pipeline: ReadonlyArray<Validator<any, any, any>>,
  cache: PipelineCache<TResult>,
  getContext: MountValidatorPipelineArgs<TResult>['getContext'],
  scope: 'field' | 'form',
  startIndex: number,
  firstResult: PromiseLike<MountValidationExecutionResult<TResult>>,
  hasFailedBefore: boolean,
  onResult?: (result: PipelineResult<TResult>) => void,
): Promise<void> {
  let hasFailed = hasFailedBefore

  const firstExecutionResult = await firstResult
  if (
    processMountValidationExecutionResult(
      startIndex,
      firstExecutionResult,
      onResult,
    )
  ) {
    hasFailed = true
  }

  for (let i = startIndex + 1; i < pipeline.length; i++) {
    const validator = pipeline[i]!
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) break

    const result = executeMountValidator<TResult>(
      cache,
      getContext,
      scope,
      validator,
      i,
    )
    const executionResult = isPromiseLike(result) ? await result : result

    if (processMountValidationExecutionResult(i, executionResult, onResult)) {
      hasFailed = true
    }
  }
}

function runMountValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  cache,
  getContext,
  scope,
  onResult,
}: MountValidatorPipelineArgs<TResult>): FormMountValidatorPipelineResult {
  if (pipeline.length === 0)
    return {
      didRun: false,
      asyncPromise: null,
    }

  if (!pipeline.some((validator) => validator.runOnMount === true))
    return {
      didRun: false,
      asyncPromise: null,
    }

  let hasFailed = false

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) {
      return {
        didRun: true,
        asyncPromise: null,
      }
    }

    const result = executeMountValidator<TResult>(
      cache,
      getContext,
      scope,
      validator,
      i,
    )

    if (isPromiseLike(result)) {
      return {
        didRun: true,
        asyncPromise: continueMountValidationFromAsyncResult(
          pipeline,
          cache,
          getContext,
          scope,
          i,
          result,
          hasFailed,
          onResult,
        ),
      }
    }

    if (processMountValidationExecutionResult(i, result, onResult)) {
      hasFailed = true
    }
  }

  return {
    didRun: true,
    asyncPromise: null,
  }
}

export function runFormMountValidatorPipeline({
  pipeline,
  formApi,
  onResult,
}: FormMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormValidateResult<any>>({
    pipeline,
    cache: formApi._pipelineCache,
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi,
      value: formApi.state.values,
      parseIssues: (issues) =>
        parseStandardSchemaIssues(issues, formApi.state.values, 'form'),
    }),
    scope: 'form',
    onResult,
  })
}

interface FieldValidatorPipelineArgs {
  pipeline: Array<FieldValidator<any, any, any>>
  context: FieldInputContext
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
  /**
   * @private
   * When an incoming watched field notifies, we should only run validators
   * that are actually interested in it.
   */
  validatorIndecesToRun?: Array<number> | null
}

export interface FieldValidatorPipelineResult {
  results: Array<PipelineResult<FieldValidateResult>>
  hasErrors: boolean
  thrownError: unknown | null
}

export function runFieldValidatorPipeline({
  pipeline,
  context,
  onResult,
  validatorIndecesToRun = null,
}: FieldValidatorPipelineArgs): Promise<FieldValidatorPipelineResult> {
  const fieldApi = context.fieldApi as AnyInternalFieldApi

  if (fieldApi._isKilled)
    return Promise.resolve({
      results: [],
      hasErrors: false,
      thrownError: null,
    })

  const cache = fieldApi._getOrCreatePipelineCache()

  return runValidatorPipeline<FieldValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
    // No use case for configuring this outside of field pipeline yet
    hasFailedBefore: false,
    getContext: (ctx) => ({
      event: ctx.event,
      formApi: ctx.formApi,
      signal: ctx.signal,
      fieldApi: context.fieldApi,
      value: context.fieldApi.value,
      parseIssues: parseFieldIssues,
    }),
    scope: 'field',
    validatorIndecesToRun,
  })
}

interface FieldMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FieldValidator<any, any, any>>
  fieldApi: AnyInternalFieldApi
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
}

export function runFieldMountValidatorPipeline({
  pipeline,
  fieldApi,
  onResult,
}: FieldMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FieldValidateResult>({
    pipeline,
    cache: fieldApi._getOrCreatePipelineCache(),
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi: fieldApi.form as never,
      fieldApi: fieldApi as never,
      value: fieldApi.value,
      parseIssues: parseFieldIssues,
    }),
    scope: 'field',
    onResult,
  })
}

// ===== GROUP MOUNT VALIDATION =====

type AnyInternalFormGroupApi = InternalFormGroupApi<
  any,
  any,
  any,
  any,
  any,
  any
>

interface GroupMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormGroupValidator<any>>
  groupApi: AnyInternalFormGroupApi
  onResult?: (result: PipelineResult<FormGroupValidateResult<any>>) => void
}

export function runGroupMountValidatorPipeline({
  pipeline,
  groupApi,
  onResult,
}: GroupMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormGroupValidateResult<any>>({
    pipeline,
    cache: groupApi._pipelineCache,
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi: groupApi.form as never,
      groupApi: groupApi as never,
      triggerFieldApi: undefined,
      value: groupApi.value,
      parseIssues: (issues) =>
        parseStandardSchemaIssues(issues, groupApi.value, 'form'),
    }),
    scope: 'form',
    onResult,
  })
}
