import { batch } from '@tanstack/store'
import { getBy } from './utils.lib'
import { ValidationRunTracker } from './pipeline/runTracker.lib'
import { visitFieldSubtree } from './FieldApi/fieldTraversal.lib'
import type { PipelineRun } from './pipeline/state.lib'
import type { AnyValidatorInstance } from './pipeline/validation/ValidatorInstance.lib'
import type { InternalRootFieldApi } from './FieldApi/RootFieldApi.lib'
import type {
  AnyInternalFieldApi,
  InternalFieldValidatorInstance,
} from './FieldApi/FieldApi.lib'

interface SubmissionField {
  /**
   * Field value reference captured when the attempt starts.
   */
  value: any
  /**
   * Validator instances captured when the attempt starts.
   */
  validators: Array<InternalFieldValidatorInstance>
}

export interface SubmissionInput {
  /**
   * Full form value reference used to capture each participating field's value.
   */
  values: unknown
  /**
   * Submitted form or group value reference passed to validation and callbacks.
   */
  value: unknown
  /**
   * Root or group node whose participating fields are captured.
   */
  node: AnyInternalFieldApi | InternalRootFieldApi
  /**
   * Form or group validator instances to capture, or `null` when none are installed.
   */
  validators: ReadonlyArray<AnyValidatorInstance> | null
}

/**
 * Owns one submission's captured input, cancellation state, and promise.
 */
export class SubmissionAttempt<TError = any> {
  private phase: 'validating' | 'callbacks' | 'discarded' | 'completed' =
    'validating'
  /**
   * Whether this attempt is still attached to its owning form or group.
   * Detached callbacks can settle the promise but cannot apply results.
   */
  private attached = true
  private readonly controller = new AbortController()
  /**
   * Aborted on cancellation or invalidation, including during callbacks.
   * Completing or failing an attempt does not abort it.
   */
  readonly signal: AbortSignal
  private readonly runs = new ValidationRunTracker()
  /**
   * Fields with their own listeners or listeners watching them, captured for
   * submit notifications.
   */
  readonly fieldsToNotify: Array<AnyInternalFieldApi> = []
  /**
   * Field identities and validation inputs captured for nodes with validators.
   */
  readonly fieldsToValidate = new Map<AnyInternalFieldApi, SubmissionField>()

  /**
   * Form or group validator instances captured when the attempt starts.
   */
  readonly validators: Array<AnyValidatorInstance> | null
  /**
   * Form or group value reference captured when the attempt starts.
   * Doesn't clonee it.
   */
  readonly value: any
  private readonly onFinish: (
    attempt: SubmissionAttempt<TError>,
    successful: boolean,
  ) => void

  /**
   * Resolves the public promise with returned errors, or `[]` on cancellation.
   */
  private resolve!: (errors: Array<TError>) => void
  /**
   * Rejects the public promise with an exception propagated by either step.
   */
  private reject!: (error: unknown) => void
  /**
   * Promise returned by `handleSubmit()` for this attempt.
   * Resolves with errors (empty on success or cancellation) or rejects on failure.
   * Invalidation during callbacks still waits for their outcome.
   */
  readonly promise = new Promise<Array<TError>>((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })

  /**
   * Settles an active attempt with the callback step's errors and success status.
   */
  complete(errors: Array<TError>, successful: boolean): void {
    if (!this.isActive()) return
    this.phase = 'completed'
    this.onFinish(this, successful)
    this.resolve(errors)
  }

  /**
   * Rejects an active attempt after a validation or callback step throws or rejects.
   */
  fail(error: unknown): void {
    if (!this.isActive()) return
    this.phase = 'completed'
    this.onFinish(this, false)
    this.reject(error)
  }

  constructor(
    input: SubmissionInput,
    onFinish: (attempt: SubmissionAttempt<TError>, successful: boolean) => void,
  ) {
    this.value = input.value
    this.validators = input.validators?.slice() ?? null
    this.onFinish = onFinish
    this.signal = this.controller.signal

    visitFieldSubtree(input.node, (field) => {
      if (
        field._listenerInstances?.length ||
        field.form._watchingListenerFields.has(field.name)
      ) {
        this.fieldsToNotify.push(field)
      }

      const validators = field._validatorInstances
      // Unlike listeners, we don't need watching validators
      // - Groups should only care about subfields
      // - Forms check all fields anyway
      if (!validators?.length) return

      this.fieldsToValidate.set(field, {
        value: getBy(input.values, field.name),
        validators: validators.slice(),
      })
    })
  }

  /**
   * Whether the attempt is still validating or running callbacks.
   * Detached callbacks remain active until the attempt completes or fails.
   */
  isActive = (): boolean => {
    return this.phase === 'validating' || this.phase === 'callbacks'
  }

  /**
   * Whether validation or submit errors may still update the owning form or group.
   * Requires an active attempt that has not been invalidated.
   */
  canApplyValidationResults = (): boolean => {
    return this.attached && this.isActive()
  }

  /**
   * Enters the callback phase. Returns `false` if the attempt is no longer validating.
   */
  beginCallbacks(): boolean {
    if (this.phase !== 'validating') return false
    this.phase = 'callbacks'
    return true
  }

  /**
   * Detaches an active attempt from live state and aborts its signal.
   * During validation, also cancels runs and resolves the promise with `[]`.
   * Callbacks already in progress still settle the promise with their outcome.
   */
  invalidate = (): void => {
    if (!this.canApplyValidationResults()) return
    if (this.phase === 'validating') {
      this.cancel()
      return
    }
    this.attached = false
    this.controller.abort()
  }

  /**
   * Tracks validation work for cancellation and returns a function to unregister it.
   * Cancels the supplied run immediately if the attempt is inactive or detached.
   */
  registerRun = (run: PipelineRun<any>): (() => void) => {
    if (!this.canApplyValidationResults()) {
      run.cancel()
      return () => {}
    }
    return this.runs.register(run)
  }

  /**
   * Discards a validating attempt, aborts its signal, and cancels its runs.
   * Resolves the promise with `[]`. Has no effect once callbacks have started.
   */
  cancel = (): void => {
    if (this.phase !== 'validating') return
    this.phase = 'discarded'
    this.attached = false
    batch(() => {
      this.controller.abort()
      this.onFinish(this, false)
      this.resolve([])
      this.runs.cancelAll()
    })
  }
}
