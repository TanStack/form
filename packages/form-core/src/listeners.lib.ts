import { LiteDebouncer } from '@tanstack/pacer-lite'
import type { PipelineCache } from './utils.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { InternalFormApi } from './FormApi/FormApi.lib'
import type {
  AnyFieldListener,
  AnyFormListener,
  FieldListenerContext,
  FieldListenerTriggers,
  FormListenerContext,
  Listener,
  ListenerDebounceFn,
  ListenerPredicateFn,
  ListenerTriggerOption,
} from './listeners.public'

type ListenerEvent = FieldListenerTriggers

type FormInputContext = {
  event: ListenerEvent
  triggerFieldApi?: AnyInternalFieldApi
  formApi: InternalFormApi<any, any, any>
}

type FieldInputContext = {
  event: ListenerEvent
  fieldApi: AnyInternalFieldApi
  formApi: InternalFormApi<any, any, any>
}

type InputContext = FormInputContext | FieldInputContext
type ListenerContext =
  FormListenerContext<any, any> | FieldListenerContext<any, any, any, any, any>
type AnyListener = AnyFormListener | AnyFieldListener

export type ListenerDebouncer = LiteDebouncer<
  (context: ListenerContext) => void
>

function isFormContext(ctx: InputContext): ctx is FormInputContext {
  return 'triggerFieldApi' in ctx
}

function getContextValue(context: InputContext) {
  return isFormContext(context)
    ? context.formApi.state.values
    : context.fieldApi.value
}

function getEnabledState(
  booleanOrFn: boolean | ListenerPredicateFn<any, any>,
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
  numberOrFn: number | ListenerDebounceFn<any, any>,
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

function isListenerTriggerEnabled(
  trigger: ListenerTriggerOption<any, any, any>,
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

function shouldRunListener(
  listener: Listener<any, any, any>,
  context: InputContext,
): boolean {
  return listener.triggers.some((trigger) =>
    isListenerTriggerEnabled(trigger, context),
  )
}

function getListenerDebounceMs(
  listener: Listener<any, any, any>,
  context: InputContext,
): number {
  if (context.event === 'submit') return 0

  const { triggerDebounceMs = 0 } = listener

  return getDebounceMs(triggerDebounceMs, context)
}

function getOrCreateDebouncer(
  cache: PipelineCache<any>,
  cacheKey: number,
  fn: (context: ListenerContext) => void,
  wait: number,
): ListenerDebouncer {
  let debouncer = cache.listenerDebouncers.get(cacheKey)

  if (!debouncer) {
    debouncer = new LiteDebouncer(fn, {
      wait,
    })

    cache.listenerDebouncers.set(cacheKey, debouncer)
  } else {
    debouncer.fn = fn
    debouncer.options.wait = wait
  }

  return debouncer
}

function executeListener(
  listener: AnyListener,
  context: ListenerContext,
): void {
  Promise.resolve(listener.run(context as never)).catch((error) => {
    console.error('Listener threw an error:', error)
  })
}

function runListener<TContext extends InputContext>({
  listener,
  context,
  listenerIndex,
  cache,
  getContext,
}: {
  listener: AnyListener
  context: TContext
  listenerIndex: number
  cache: PipelineCache<any>
  getContext: (inputContext: TContext) => ListenerContext
}): void {
  const cacheKey = listenerIndex
  const debounceMs = getListenerDebounceMs(listener, context)
  const listenerContext = getContext(context)

  if (debounceMs <= 0) {
    executeListener(listener, listenerContext)
    return
  }

  const debouncer = getOrCreateDebouncer(
    cache,
    cacheKey,
    (ctx) => executeListener(listener, ctx),
    debounceMs,
  )

  debouncer.maybeExecute(listenerContext)
}

function runListenerPipeline<TContext extends InputContext>({
  pipeline,
  context,
  cache,
  getContext,
}: {
  pipeline: ReadonlyArray<AnyListener>
  context: TContext
  cache: PipelineCache<any>
  getContext: (inputContext: TContext) => ListenerContext
}): void {
  pipeline.forEach((listener, listenerIndex) => {
    if (!shouldRunListener(listener, context)) {
      return
    }

    runListener({
      listener,
      context,
      listenerIndex,
      cache,
      getContext,
    })
  })
}

interface FormListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyFormListener>
  context: FormInputContext
}

export function runFormListenerPipeline({
  pipeline,
  context,
}: FormListenerPipelineArgs): void {
  const cache = context.formApi._pipelineCache
  return runListenerPipeline({
    pipeline,
    context,
    cache,
    getContext: (ctx) => ({
      formApi: ctx.formApi,
      triggerFieldApi: ctx.triggerFieldApi,
      value: ctx.formApi.state.values,
    }),
  })
}

interface FieldListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyFieldListener>
  context: FieldInputContext
  /**
   * @private
   * When an incoming watched field notifies, we should only run listeners
   * that are actually interested in it.
   */
  listenerIndecesToRun: Array<number> | null
}

export function runFieldListenerPipeline({
  pipeline: incomingPipeline,
  context,
  listenerIndecesToRun,
}: FieldListenerPipelineArgs): void {
  if (context.fieldApi._isKilled) return

  const cache = context.fieldApi._getOrCreatePipelineCache()

  const pipeline = listenerIndecesToRun
    ? incomingPipeline.filter((_, i) => listenerIndecesToRun.includes(i))
    : incomingPipeline

  return runListenerPipeline({
    pipeline,
    context,
    cache,
    getContext: (ctx) => ({
      value: ctx.fieldApi.value,
      fieldApi: context.fieldApi,
      formApi: ctx.formApi,
    }),
  })
}
