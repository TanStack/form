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
  /** Field value reference captured when the attempt starts. */
  value: any
  /** Validator instances captured when the attempt starts. */
  validators: Array<InternalFieldValidatorInstance>
}

export interface SubmissionInput {
  /** Full form value reference used to capture each participating field's value. */
  values: unknown
  /** Submitted form or group value reference passed to validation and callbacks. */
  value: unknown
  /** Root or group node whose participating fields are captured. */
  node: AnyInternalFieldApi | InternalRootFieldApi
  /** Form or group validator instances to capture, or `null` when none are installed. */
  validators: ReadonlyArray<AnyValidatorInstance> | null
}

/** Owns one submission's captured input, cancellation state, and promise. */
export class SubmissionAttempt<TError = any> {
  private phase: 'validating' | 'callbacks' | 'discarded' | 'completed' =
    'validating'
  /**
   * Whether this attempt can still publish results while active.
   * Invalidation clears this flag but lets callbacks already in progress finish.
   */
  private attached = true
  private readonly runs = new ValidationRunTracker()
  /**
   * Fields with their own listeners or listeners watching them, captured for
   * submit notifications.
   */
  readonly notificationFields: Array<AnyInternalFieldApi> = []
  /** Field identities and validation inputs captured for nodes with validators. */
  readonly fields = new Map<AnyInternalFieldApi, SubmissionField>()

  /** Form or group validator instances captured when the attempt starts. */
  readonly validators: Array<AnyValidatorInstance> | null
  /** Form or group value captured when the attempt starts. */
  readonly value: any
  private readonly onFinish: (
    attempt: SubmissionAttempt<TError>,
    successful: boolean,
  ) => void

  /** Resolves the public promise with returned errors, or `[]` on cancellation. */
  private resolve!: (errors: Array<TError>) => void
  /** Rejects the public promise with an exception propagated by either step. */
  private reject!: (error: unknown) => void
  /**
   * Promise returned by `handleSubmit()` for this attempt.
   * Resolves with errors (empty on success or cancellation) or rejects on failure.
   */
  readonly promise = new Promise<Array<TError>>((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })

  /** Settles an active attempt with the callback step's errors and success status. */
  complete(errors: Array<TError>, successful: boolean): void {
    if (!this.isActive()) return
    this.phase = 'completed'
    this.onFinish(this, successful)
    this.resolve(errors)
  }

  /** Rejects an active attempt after a validation or callback step throws or rejects. */
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

    visitFieldSubtree(input.node, (field) => {
      if (
        field._listenerInstances?.length ||
        field.form._watchingListenerFields.has(field.name)
      ) {
        this.notificationFields.push(field)
      }

      const validators = field._validatorInstances
      // Unlike listeners, we don't need watching validators
      // - Groups should only care about subfields
      // - Forms check all fields anyway
      if (!validators?.length) return

      this.fields.set(field, {
        value: getBy(input.values, field.name),
        validators: validators.slice(),
      })
    })
  }

  /** Whether the attempt is still validating or running callbacks. */
  isActive = (): boolean => {
    return this.phase === 'validating' || this.phase === 'callbacks'
  }

  /** Whether the active attempt is still attached to its owner's current state. */
  canApplyValidationResults = (): boolean => {
    return this.attached && this.isActive()
  }

  /**
   * Starts the callback phase only if validation has not been cancelled.
   * @returns whether the phase was applied or not.
   */
  beginCallbacks(): boolean {
    if (this.phase !== 'validating') return false
    this.phase = 'callbacks'
    return true
  }

  /**
   * Detaches the attempt from live state and cancels it during validation.
   * Callbacks already in progress can still finish and settle the public promise.
   */
  invalidate = (): void => {
    this.attached = false
    if (this.phase === 'validating') this.cancel()
  }

  /**
   * Tracks participating validation work and returns a function to unregister it.
   * Inactive attempts cancel the supplied run immediately.
   */
  registerRun = (run: PipelineRun<any>): (() => void) => {
    if (!this.isActive()) {
      run.cancel()
      return () => {}
    }
    return this.runs.register(run)
  }

  /** Discards an active attempt, resolves `promise` with `[]`, and cancels its runs. */
  cancel = (): void => {
    if (!this.isActive()) return
    this.phase = 'discarded'
    batch(() => {
      this.onFinish(this, false)
      this.resolve([])
      this.runs.cancelAll()
    })
  }
}
