import { LiteDebouncer } from '@tanstack/pacer-lite'
import {
  isStandardSchema,
  parseStandardSchema,
  parseStandardSchemaIssues,
} from '../standardSchema.lib'
import type { PipelineCache } from '../utils.lib'
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
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'

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
export type AnyPipelineValidator =
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

function isFieldContext(ctx: InputContext): ctx is FieldInputContext {
  return ctx.scope === 'field'
}

function isGroupContext(ctx: InputContext): ctx is FormGroupInputContext {
  return ctx.scope === 'group'
}

export function isServerValidateContext(
  ctx: ValidateContext,
): ctx is ServerPipelineValidateContext {
  return ctx.event === 'server'
}

export function isFieldValidateContext(
  ctx: ValidateContext,
): ctx is FieldValidateContext {
  return ctx.scope === 'field'
}

function isServerTrigger(
  trigger: ValidationTriggerOption<any, any, any> | 'server',
): boolean {
  return trigger === 'server'
}

function hasServerTrigger(validator: AnyPipelineValidator): boolean {
  return validator.triggers.some(isServerTrigger)
}

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

export type ValidationDebouncer<TResult extends ValidateResult> = LiteDebouncer<
  (call: PendingDebouncedCall<TResult>) => void
>

function getEnabledState(
  booleanOrFn: boolean | ((context: any) => boolean),
  context: InputContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn
  if (isServerContext(context)) return false

  return booleanOrFn(getPredicateContext(context))
}

function getDebounceMs(
  numberOrFn: number | ((context: any) => number),
  context: InputContext,
): number {
  if (typeof numberOrFn === 'number') return numberOrFn
  if (isServerContext(context)) return 0

  return numberOrFn(getPredicateContext(context))
}

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
  validator: AnyPipelineValidator
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
  validator: AnyPipelineValidator,
  context: InputContext,
): number {
  if (context.event === 'submit' || context.event === 'server') return 0

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

export function createValidatorAbortContext<TResult extends ValidateResult>(
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

export function runMaybeDebouncedValidator<TResult extends ValidateResult>({
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
