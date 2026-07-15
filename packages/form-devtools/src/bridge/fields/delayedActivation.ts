interface DelayedActivationOptions<TKey> {
  delayMs: number
  canActivate: (key: TKey) => boolean
  onChange: (key: TKey, active: boolean) => void
}

interface PendingActivation {
  phase: 'pending'
  deadline: number
}

interface ActiveActivation {
  phase: 'active'
}

type Activation = PendingActivation | ActiveActivation

export interface DelayedActivationController<TKey> {
  dispose: () => void
  isActive: (key: TKey) => boolean
  observe: (key: TKey, requested: boolean) => void
  remove: (key: TKey) => void
  removeWhere: (predicate: (key: TKey) => boolean) => void
}

/**
 * Delays activation while keeping deactivation immediate.
 *
 * Repeated positive observations preserve the original activation deadline.
 * Removing a pending or active key is silent and is intended for lifecycle
 * cleanup where the consumer is already removing the corresponding state.
 */
export function createDelayedActivationController<TKey>({
  delayMs,
  canActivate,
  onChange,
}: DelayedActivationOptions<TKey>): DelayedActivationController<TKey> {
  const activations = new Map<TKey, Activation>()
  let disposed = false
  let scheduledDeadline: number | undefined
  let activationTimer: ReturnType<typeof setTimeout> | undefined

  const clearActivationTimer = (): void => {
    if (activationTimer !== undefined) clearTimeout(activationTimer)
    activationTimer = undefined
    scheduledDeadline = undefined
  }

  const scheduleNextActivation = (): void => {
    if (disposed) {
      clearActivationTimer()
      return
    }

    let nextDeadline: number | undefined
    for (const activation of activations.values()) {
      if (activation.phase !== 'pending') continue
      if (nextDeadline === undefined || activation.deadline < nextDeadline) {
        nextDeadline = activation.deadline
      }
    }

    if (nextDeadline === undefined) {
      clearActivationTimer()
      return
    }
    if (activationTimer !== undefined && scheduledDeadline === nextDeadline) {
      return
    }

    clearActivationTimer()
    scheduledDeadline = nextDeadline
    activationTimer = setTimeout(
      () => {
        activationTimer = undefined
        scheduledDeadline = undefined
        const now = Date.now()
        const activatedKeys: Array<TKey> = []

        for (const [key, activation] of activations) {
          if (activation.phase !== 'pending' || activation.deadline > now) {
            continue
          }

          if (!canActivate(key)) {
            activations.delete(key)
            continue
          }

          activations.set(key, { phase: 'active' })
          activatedKeys.push(key)
        }

        scheduleNextActivation()
        for (const key of activatedKeys) onChange(key, true)
      },
      Math.max(0, nextDeadline - Date.now()),
    )
  }

  const remove = (key: TKey): void => {
    const activation = activations.get(key)
    if (!activation) return

    activations.delete(key)
    if (activation.phase === 'pending') scheduleNextActivation()
  }

  const observe = (key: TKey, requested: boolean): void => {
    if (disposed) return

    const current = activations.get(key)

    if (!requested) {
      if (!current) return

      remove(key)
      if (current.phase === 'active') onChange(key, false)
      return
    }

    if (current) return

    activations.set(key, {
      phase: 'pending',
      deadline: Date.now() + delayMs,
    })
    scheduleNextActivation()
  }

  return {
    dispose: () => {
      if (disposed) return
      disposed = true
      clearActivationTimer()
      activations.clear()
    },
    isActive: (key) => activations.get(key)?.phase === 'active',
    observe,
    remove,
    removeWhere: (predicate) => {
      let removedPending = false
      for (const [key] of activations) {
        if (!predicate(key)) continue
        if (activations.get(key)?.phase === 'pending') removedPending = true
        activations.delete(key)
      }
      if (removedPending) scheduleNextActivation()
    },
  }
}
