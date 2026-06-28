import { EventClient } from '@tanstack/devtools-event-client'
import type { FormEventMap } from './eventClientTypes'

const formEventClient = new EventClient<FormEventMap>({
  pluginId: 'tanstack-form',
})

type FormEventName = keyof FormEventMap & string

interface FormEvent<TEventName extends FormEventName> {
  type: string
  payload: FormEventMap[TEventName]
  pluginId?: string
}

const localEventTarget = new EventTarget()

function getEventType<TEventName extends FormEventName>(eventName: TEventName) {
  return `${formEventClient.getPluginId()}:${eventName}` as const
}

export function emitFormEvent<TEventName extends FormEventName>(
  eventName: TEventName,
  payload: FormEventMap[TEventName],
) {
  formEventClient.emit(eventName, payload)
  localEventTarget.dispatchEvent(
    new CustomEvent(getEventType(eventName), {
      detail: formEventClient.createEventPayload(eventName, payload),
    }),
  )
}

export function onFormEvent<TEventName extends FormEventName>(
  eventName: TEventName,
  cb: (event: FormEvent<TEventName>) => void,
) {
  const eventType = getEventType(eventName)
  const localHandler = (event: Event) => {
    cb((event as CustomEvent<FormEvent<TEventName>>).detail)
  }
  const unsubscribeBus = formEventClient.on(eventName, cb)

  localEventTarget.addEventListener(eventType, localHandler)

  return () => {
    unsubscribeBus()
    localEventTarget.removeEventListener(eventType, localHandler)
  }
}
