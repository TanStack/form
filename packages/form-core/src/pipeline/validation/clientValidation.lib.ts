import { batch } from '@tanstack/store'
import { watchesField } from '../../FieldApi/linked-fields.lib'
import { resolveDebounceMs } from '../selection.lib'
import { runPipeline } from '../runPipeline.lib'
import { isErrorResult } from '../../validation/results/errors.lib'
import { ValidationResultCollector } from './resultCollection.lib'
import { selectValidator } from './selection.lib'
import type {
  AnyValidatorInstance,
  ValidatorDefinition,
} from './ValidatorInstance.lib'
import type {
  PipelineEntry,
  PipelineInput,
  PipelineResult,
  PipelineRun,
} from '../state.lib'
import type { ValidationRunTracker } from '../runTracker.lib'
import type { ClientSideEvents } from '../events.public'
import type { Awaitable } from '../../types.public'
import type { SubmissionAttempt } from '../../submissionAttempt.lib'

export interface ClientValidationRun<
  TInstance extends AnyValidatorInstance,
> extends PipelineRun<TInstance> {
  collector: ValidationResultCollector<TInstance>
  validatorCount: number
}

export interface ClientValidationOptions<
  TInstance extends AnyValidatorInstance,
> {
  /** Log startup and completion failures without replacing the completion promise. */
  catchErrors: boolean
  tracker: ValidationRunTracker | null
  validators: ReadonlyArray<TInstance> | null
  event: ClientSideEvents | 'mount'
  watchedFieldName?: string
  upstreamInvalid?: Awaitable<boolean>
  submission?: SubmissionAttempt
  createPredicateContext: () => any
  createContext: (
    definition: ValidatorDefinition,
    signal: AbortSignal,
  ) => { value: any }
  onSelected?: (selected: ReadonlySet<TInstance>) => void
  onSkip?: (instance: TInstance) => void
  applyResult?: (result: PipelineResult<TInstance>) => void
  onPending: () => () => void
  onRegister?: (run: ClientValidationRun<TInstance>) => () => void
}

export function startClientValidation<TInstance extends AnyValidatorInstance>(
  options: ClientValidationOptions<TInstance>,
): ClientValidationRun<TInstance> | undefined {
  const { event } = options
  const lifetime = { cancelled: false, finished: false }

  let cancelPipeline: (() => void) | undefined
  let run!: ClientValidationRun<TInstance>
  let release: (() => void) | undefined
  let finishContribution: (() => void) | undefined
  let releaseExternal: (() => void) | undefined

  const collector = new ValidationResultCollector<TInstance>()
  const finish = () => {
    if (lifetime.finished) return
    lifetime.finished = true
    release?.()
    releaseExternal?.()
    finishContribution?.()
  }

  const accept = (results: Array<PipelineResult<TInstance>>) => {
    collector.collect(results)
    if (
      !lifetime.cancelled &&
      options.submission?.canApplyValidationResults() !== false &&
      options.applyResult
    ) {
      batch(() => {
        // Application can synchronously change values or reset the owner.
        for (const result of results) {
          if (lifetime.cancelled) break
          options.applyResult!(result)
        }
      })
    }
  }

  try {
    const validators = options.validators?.slice() ?? null
    const entries: Array<PipelineEntry<TInstance>> = []
    const disabled = new Set<TInstance>()

    for (const instance of validators ?? []) {
      if (
        options.watchedFieldName !== undefined &&
        !watchesField(instance.definition.watchFields, options.watchedFieldName)
      ) {
        continue
      }

      const definition = instance.definition
      const entry: PipelineEntry<TInstance> = {
        instance: instance as PipelineEntry<TInstance>['instance'],
        bailIfInvalid: definition.bailIfInvalid,
      }

      try {
        const createPredicateContext =
          event === 'mount' ? undefined : options.createPredicateContext

        const selection = selectValidator(definition, {
          event,
          createPredicateContext,
        })

        if (selection === 'cancel') disabled.add(instance)
        if (selection !== 'run') continue

        entry.debounceMs = resolveDebounceMs(
          definition,
          event,
          options.createPredicateContext,
        )
      } catch (error) {
        entry.preparationFailure = { error }
      }
      // Failed preparations also retain their previous source errors.
      entries.push(entry)
    }

    const pipeline = runPipeline<TInstance>({
      entries,
      supersede: !options.submission,
      input: {
        createContext: options.createContext,
      } as PipelineInput<TInstance>,
      upstreamInvalid: options.upstreamInvalid,
      onCancel: options.submission ? () => run.cancel() : undefined,
      onStart: (cancel, cancelInstances) => {
        // Note: This nesting is a bit silly. We should refactor sometime.
        cancelPipeline = cancel
        run = {
          syncResults: [],
          pending: null,
          hasPendingWork: false,
          collector,
          validatorCount: validators?.length ?? 0,
          cancel: () => {
            if (lifetime.cancelled || lifetime.finished) return
            lifetime.cancelled = true
            options.submission?.cancel()
            cancel()
            finish()
          },
          cancelInstances,
        }
        // Bind cancellation before registration or publication can reenter.
        release = options.submission
          ? options.submission.registerRun(run)
          : options.tracker?.register(run)

        if (lifetime.finished) release?.()

        releaseExternal = options.submission
          ? undefined
          : options.onRegister?.(run)

        if (lifetime.finished) releaseExternal?.()

        if (!options.submission && !lifetime.cancelled && disabled.size > 0) {
          options.tracker?.cancelInstances(disabled)
        }
        if (!lifetime.cancelled) {
          const selected = new Set(entries.map(({ instance }) => instance))
          options.onSelected?.(selected)
        }
      },
      isInvalid: ({ result }) => isErrorResult(result),
      onDeferredResults: accept,
      onSkip: options.onSkip,
    })
    run.syncResults = pipeline.syncResults
    run.pending = pipeline.pending
    run.hasPendingWork = pipeline.hasPendingWork
    if (run.pending) {
      // Observe failures before state publication or initial result application.
      void run.pending.then(finish, finish)
      if (run.hasPendingWork && !lifetime.cancelled) {
        // Install cleanup before subscribers can reset or replace this run.
        batch(() => {
          finishContribution = options.onPending()
          if (lifetime.finished) finishContribution()
        })
      }
    }
    accept(run.syncResults)
    if (!run.hasPendingWork) finish()
    if (options.catchErrors) {
      void run.pending?.catch((error) => console.error(error))
    }
    return run
  } catch (error) {
    // Failure teardown must not turn an active submission into cancellation.
    let failure = error
    try {
      lifetime.cancelled = true
      cancelPipeline?.()
      finish()
    } catch (cleanupError) {
      failure = cleanupError
    }
    if (options.catchErrors) {
      console.error(failure)
      return undefined
    }
    throw failure
  }
}
