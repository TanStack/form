import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalListenerInstance } from './ListenerInstance.lib'
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

function executeListener(
  listener: AnyListener,
  context: ListenerContext,
): void {
  Promise.resolve(listener.run(context as never)).catch((error) => {
    console.error('Listener threw an error:', error)
  })
}

function runListener<TContext extends InputContext>({
  listenerInstance,
  context,
  getContext,
}: {
  listenerInstance: AnyInternalListenerInstance
  context: TContext
  getContext: (inputContext: TContext) => ListenerContext
}): void {
  const listener = listenerInstance.definition as AnyListener
  const debounceMs = getListenerDebounceMs(listener, context)
  const listenerContext = getContext(context)

  if (debounceMs <= 0) {
    executeListener(listener, listenerContext)
    return
  }

  const debouncer = listenerInstance.getOrCreateDebouncer(
    (ctx: ListenerContext) => executeListener(listener, ctx),
    debounceMs,
  )

  debouncer?.maybeExecute(listenerContext)
}

function runListenerPipeline<TContext extends InputContext>({
  pipeline,
  context,
  getContext,
  listenerInstancesToRun = null,
}: {
  pipeline: ReadonlyArray<AnyInternalListenerInstance>
  context: TContext
  getContext: (inputContext: TContext) => ListenerContext
  listenerInstancesToRun?: ReadonlySet<AnyInternalListenerInstance> | null
}): void {
  pipeline.forEach((listenerInstance) => {
    if (
      listenerInstancesToRun &&
      !listenerInstancesToRun.has(listenerInstance)
    ) {
      return
    }

    const listener = listenerInstance.definition as AnyListener
    if (!shouldRunListener(listener, context)) {
      return
    }

    runListener({
      listenerInstance,
      context,
      getContext,
    })
  })
}

interface FormListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyInternalListenerInstance>
  context: FormInputContext
}

export function runFormListenerPipeline({
  pipeline,
  context,
}: FormListenerPipelineArgs): void {
  return runListenerPipeline({
    pipeline,
    context,
    getContext: (ctx) => ({
      formApi: ctx.formApi,
      triggerFieldApi: ctx.triggerFieldApi,
      value: ctx.formApi.state.values,
    }),
  })
}

interface FieldListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyInternalListenerInstance>
  context: FieldInputContext
  /**
   * @private
   * When an incoming watched field notifies, we should only run listeners
   * that are actually interested in it.
   */
  listenerInstancesToRun: ReadonlySet<AnyInternalListenerInstance> | null
}

export function runFieldListenerPipeline({
  pipeline,
  context,
  listenerInstancesToRun,
}: FieldListenerPipelineArgs): void {
  if (context.fieldApi._isKilled) return

  return runListenerPipeline({
    pipeline,
    context,
    listenerInstancesToRun,
    getContext: (ctx) => ({
      value: ctx.fieldApi.value,
      fieldApi: context.fieldApi,
      formApi: ctx.formApi,
    }),
  })
}
