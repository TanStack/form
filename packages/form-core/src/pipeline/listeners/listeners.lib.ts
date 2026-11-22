import { watchesField } from '../../FieldApi/linked-fields.lib'
import { resolveDebounceMs, selectTriggers } from '../selection.lib'
import { runPipeline } from '../runPipeline.lib'
import {
  createFieldListenerContext,
  createFormListenerContext,
  createListenerPredicateContext,
} from './listenerContext.lib'
import type {
  FieldListenerContextInput,
  FormListenerContextInput,
  ListenerContext,
} from './listenerContext.lib'
import type { FieldListenerTriggers } from './listeners.public'
import type {
  AnyListenerInstance,
  ListenerDefinition,
} from './ListenerInstance.lib'
import type { PipelineEntry } from '../state.lib'

interface FormInputContext extends FormListenerContextInput {
  event: FieldListenerTriggers
}

interface FieldInputContext extends FieldListenerContextInput {
  event: FieldListenerTriggers
}

type InputContext = FormInputContext | FieldInputContext

function runListenerPipeline<TContext extends InputContext>({
  pipeline,
  context,
  getContext,
  watchedFieldName,
}: {
  pipeline: ReadonlyArray<AnyListenerInstance>
  context: TContext
  getContext: (inputContext: TContext, signal: AbortSignal) => ListenerContext
  watchedFieldName?: string
}): void {
  const createPredicateContext = () => createListenerPredicateContext(context)
  const entries: Array<PipelineEntry<AnyListenerInstance>> = []
  const disabled: Array<AnyListenerInstance> = []
  for (const listenerInstance of pipeline) {
    if (listenerInstance.disposed) continue
    if (
      watchedFieldName !== undefined &&
      !watchesField(listenerInstance.definition.watchFields, watchedFieldName)
    ) {
      continue
    }

    const entry: PipelineEntry<AnyListenerInstance> = {
      instance: listenerInstance,
    }
    try {
      const listener = listenerInstance.definition as ListenerDefinition
      const selection = selectTriggers(
        listener.triggers,
        context.event,
        createPredicateContext,
      )
      if (selection === 'skip') continue
      if (selection === 'cancel') {
        disabled.push(listenerInstance)
        continue
      }

      entry.debounceMs = resolveDebounceMs(
        listener,
        context.event,
        createPredicateContext,
      )
    } catch (error) {
      entry.preparationFailure = { error }
    }
    entries.push(entry)
  }

  try {
    for (const listenerInstance of disabled) listenerInstance.resetRuntime()
    const run = runPipeline({
      entries,
      input: { createContext: (signal) => getContext(context, signal) },
    })
    void run.pending?.catch((error: unknown) => {
      console.error('Listener threw an error:', error)
    })
  } catch (error) {
    console.error('Listener threw an error:', error)
  }
}

interface FormListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyListenerInstance>
  context: FormInputContext
}

export function runFormListenerPipeline({
  pipeline,
  context,
}: FormListenerPipelineArgs): void {
  return runListenerPipeline({
    pipeline,
    context,
    getContext: createFormListenerContext,
  })
}

interface FieldListenerPipelineArgs {
  pipeline: ReadonlyArray<AnyListenerInstance>
  context: FieldInputContext
  /**
   * @private
   * When an incoming watched field notifies, we should only run listeners
   * that are actually interested in it.
   */
  watchedFieldName?: string
}

export function runFieldListenerPipeline({
  pipeline,
  context,
  watchedFieldName,
}: FieldListenerPipelineArgs): void {
  if (context.fieldApi._isKilled) return

  return runListenerPipeline({
    pipeline,
    context,
    watchedFieldName,
    getContext: createFieldListenerContext,
  })
}
