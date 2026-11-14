import { batch } from '@tanstack/store'
import { getBy } from './utils.lib'
import { ValidationRunTracker } from './pipeline/runTracker.lib'
import { visitFieldSubtree } from './FieldApi/fieldTraversal.lib'
import type { Atom } from '@tanstack/store'
import type { PipelineRun } from './pipeline/state.lib'
import type { AnyValidatorInstance } from './pipeline/validation/ValidatorInstance.lib'
import type { Awaitable } from './types.public'
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

export interface SubmissionOutcome<TError> {
  /** Errors returned to the caller when the attempt completes. */
  errors: Array<TError>
  /** Whether submission succeeded; an empty `errors` array can still mean failure. */
  successful: boolean
}

interface SubmissionOwner<TError> {
  submissions: Set<SubmissionAttempt<TError>>
  submissionAttempts: Atom<number>
  isSubmitting: Atom<boolean>
  isSubmitSuccessful: Atom<boolean>
}

interface SubmissionAttemptOptions<TError> {
  /** Full form value reference used to capture each participating field's value. */
  values: unknown
  /** Submitted form or group value reference passed to validation and callbacks. */
  value: unknown
  /** Root or group node whose participating fields are captured. */
  node: AnyInternalFieldApi | InternalRootFieldApi
  /** Form or group validator instances to capture, or `null` when none are installed. */
  validators: ReadonlyArray<AnyValidatorInstance> | null
  /** Submission registration and state for the form or group. */
  owner: SubmissionOwner<TError>
}

/** Owns one form or group submission's captured input, execution etc. */
export class SubmissionAttempt<TError = any> {
  private phase: 'validating' | 'callbacks' | 'discarded' | 'completed' =
    'validating'
  /**
   * Whether this attempt can still publish results while active.
   * Invalidation clears this flag but lets callbacks already in progress finish.
   */
  private attached = true
  private readonly runs = new ValidationRunTracker()
  /** Fields captured for root submit notifications, including those without validators. */
  readonly notificationFields: Array<AnyInternalFieldApi> = []
  /** Field identities and validation inputs captured for nodes with validators. */
  readonly fields = new Map<AnyInternalFieldApi, SubmissionField>()

  /** Form or group validator instances captured when the attempt starts. */
  readonly validators: Array<AnyValidatorInstance> | null
  /** Form or group value captured when the attempt starts. */
  readonly value: any
  private readonly owner: SubmissionOwner<TError>

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

  private finishOwner(successful: boolean): void {
    if (!this.owner.submissions.delete(this)) return
    this.owner.isSubmitting.set(this.owner.submissions.size > 0)
    this.owner.isSubmitSuccessful.set(successful)
  }

  /** Settles an active attempt with the callback step's errors and success status. */
  private complete(errors: Array<TError>, successful: boolean): void {
    if (!this.isActive()) return
    this.phase = 'completed'
    batch(() => this.finishOwner(successful))
    this.resolve(errors)
  }

  /** Rejects an active attempt after a validation or callback step throws or rejects. */
  private fail(error: unknown): void {
    if (!this.isActive()) return
    this.phase = 'completed'
    batch(() => this.finishOwner(false))
    this.reject(error)
  }

  constructor(options: SubmissionAttemptOptions<TError>) {
    this.value = options.value
    this.validators = options.validators?.slice() ?? null
    this.owner = options.owner

    visitFieldSubtree(options.node, (field) => {
      if (options.node._isRoot) this.notificationFields.push(field)
      const validators = field._validatorInstances
      if (!validators?.length) return
      this.fields.set(field, {
        value: getBy(options.values, field.name),
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
   * Runs validation followed by owner-specific callbacks and settles `promise`.
   * Cancellation during validation prevents the callback step from starting.
   */
  start = <TValidation>(steps: {
    /** Runs the owner's validation sequence and supplies the callback step's input. */
    validate: () => Awaitable<TValidation>
    /** Interprets validation results and runs submit callbacks to determine the outcome. */
    callbacks: (validation: TValidation) => Awaitable<SubmissionOutcome<TError>>
  }): void => {
    void (async () => {
      this.owner.submissions.add(this)
      batch(() => {
        this.owner.submissionAttempts.set((attempts) => attempts + 1)
        this.owner.isSubmitting.set(true)
      })
      if (!this.isActive()) return
      const validation = await steps.validate()
      if (!this.isActive()) return
      this.phase = 'callbacks'
      const outcome = await steps.callbacks(validation)
      this.complete(outcome.errors, outcome.successful)
    })().catch((error) => this.fail(error))
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
      this.finishOwner(false)
      this.resolve([])
      this.runs.cancelAll()
    })
  }
}
