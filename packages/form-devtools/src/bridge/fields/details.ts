import { LiteDebouncer } from '@tanstack/pacer-lite'
import { formDevtoolsEventClient } from '../../eventClient.lib'
import { getDevtoolsFieldDetail } from './detailSnapshot'
import type {
  AnyInternalFieldApi,
  InternalFieldMeta,
} from '@tanstack/form-core/internals'
import type {
  FieldDetailSettings,
  FieldDetailSubscriptionDescriptor,
} from '../../eventClientTypes'
import type { FormId } from '../../types/branded'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'

interface ActiveFieldDetailSubscription {
  descriptor: FieldDetailSubscriptionDescriptor
  field: AnyInternalFieldApi
  atomSubscription: { unsubscribe: () => void }
  debouncer: LiteDebouncer<() => void>
  lastObservedMeta: InternalFieldMeta
}

export interface FieldDetailsController {
  dispose: () => void
  fieldsUpdated: (fields: Iterable<AnyInternalFieldApi>) => void
  fieldSubtreeRemoved: (fields: Array<AnyInternalFieldApi>) => void
  formUnmounted: (formInstanceId: FormId) => void
}

function getSubscriptionKey({
  formInstanceId,
  fieldId,
}: FieldDetailSubscriptionDescriptor): string {
  return `${formInstanceId}\0${fieldId}`
}

function areSettingsEqual(
  left: FieldDetailSettings,
  right: FieldDetailSettings,
): boolean {
  return (
    left.includeValues === right.includeValues &&
    left.errorPayloadMode === right.errorPayloadMode &&
    left.debounceMs === right.debounceMs
  )
}

function areDescriptorsEqual(
  left: FieldDetailSubscriptionDescriptor,
  right: FieldDetailSubscriptionDescriptor,
): boolean {
  return (
    left.formInstanceId === right.formInstanceId &&
    left.fieldId === right.fieldId &&
    areSettingsEqual(left.settings, right.settings)
  )
}

export function createFieldDetailsController({
  identity,
  mountedForms,
}: {
  identity: FieldIdentityController
  mountedForms: MountedFormsController
}): FieldDetailsController {
  const subscriptions = new Map<string, ActiveFieldDetailSubscription>()
  let disposed = false

  const removeSubscription = (key: string): void => {
    const subscription = subscriptions.get(key)
    if (!subscription) return

    subscriptions.delete(key)
    subscription.atomSubscription.unsubscribe()
    subscription.debouncer.cancel()
  }

  const emitDetail = (subscription: ActiveFieldDetailSubscription): void => {
    if (disposed) return

    const key = getSubscriptionKey(subscription.descriptor)
    if (subscriptions.get(key) !== subscription) return

    const form = mountedForms.getMountedForm(
      subscription.descriptor.formInstanceId,
    )
    if (
      !form ||
      subscription.field.form !== form ||
      subscription.field._isKilled
    ) {
      removeSubscription(key)
      return
    }

    formDevtoolsEventClient.emit(
      'field-detail-changed',
      getDevtoolsFieldDetail(
        subscription.field,
        subscription.descriptor,
        identity,
      ),
    )
  }

  const scheduleDetail = (
    subscription: ActiveFieldDetailSubscription,
  ): void => {
    if (subscription.descriptor.settings.debounceMs <= 0) {
      emitDetail(subscription)
    } else {
      subscription.debouncer.maybeExecute()
    }
  }

  const subscribe = (descriptor: FieldDetailSubscriptionDescriptor): void => {
    if (disposed) return

    const key = getSubscriptionKey(descriptor)
    const existing = subscriptions.get(key)
    const form = mountedForms.getMountedForm(descriptor.formInstanceId)
    const field = identity.getField(descriptor.fieldId)

    if (!form || !field || field.form !== form || field._isKilled) {
      removeSubscription(key)
      return
    }

    if (
      existing &&
      existing.field === field &&
      areDescriptorsEqual(existing.descriptor, descriptor)
    ) {
      existing.debouncer.cancel()
      emitDetail(existing)
      return
    }

    removeSubscription(key)

    const debouncer = new LiteDebouncer(() => emitDetail(subscription), {
      wait: Math.max(0, descriptor.settings.debounceMs),
    })
    const initialState = field.atom.get()
    const subscription: ActiveFieldDetailSubscription = {
      descriptor,
      field,
      atomSubscription: { unsubscribe: () => {} },
      debouncer,
      lastObservedMeta: initialState.meta,
    }
    subscription.atomSubscription = field.atom.subscribe((state) => {
      if (
        !descriptor.settings.includeValues &&
        state.meta === subscription.lastObservedMeta
      ) {
        return
      }

      subscription.lastObservedMeta = state.meta
      scheduleDetail(subscription)
    })
    subscriptions.set(key, subscription)
    emitDetail(subscription)
  }

  const unsubscribe = (descriptor: FieldDetailSubscriptionDescriptor): void => {
    const key = getSubscriptionKey(descriptor)
    const existing = subscriptions.get(key)
    if (!existing || !areDescriptorsEqual(existing.descriptor, descriptor)) {
      return
    }

    removeSubscription(key)
  }

  const cleanupSubscribeListener = formDevtoolsEventClient.on(
    'field-detail-subscribe',
    (event) => subscribe(event.payload),
  )
  const cleanupUnsubscribeListener = formDevtoolsEventClient.on(
    'field-detail-unsubscribe',
    (event) => unsubscribe(event.payload),
  )

  return {
    dispose: () => {
      disposed = true
      cleanupSubscribeListener()
      cleanupUnsubscribeListener()
      for (const key of Array.from(subscriptions.keys())) {
        removeSubscription(key)
      }
    },
    fieldsUpdated: (fields) => {
      const updatedFields = new Set<AnyInternalFieldApi>(fields)
      if (updatedFields.size === 0) return

      for (const subscription of subscriptions.values()) {
        if (updatedFields.has(subscription.field)) scheduleDetail(subscription)
      }
    },
    fieldSubtreeRemoved: (fields) => {
      const removedFields = new Set(fields)
      for (const [key, subscription] of subscriptions) {
        if (removedFields.has(subscription.field)) removeSubscription(key)
      }
    },
    formUnmounted: (formInstanceId) => {
      for (const [key, subscription] of subscriptions) {
        if (subscription.descriptor.formInstanceId === formInstanceId) {
          removeSubscription(key)
        }
      }
    },
  }
}
