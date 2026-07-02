import { EventClient } from '@tanstack/devtools-event-client'
import type { FormDevtoolsEventMap } from './eventClientTypes'

const formDevtoolsEventClient = new EventClient<FormDevtoolsEventMap>({
  pluginId: 'tanstack-form',
})

type FormDevtoolsEventName = keyof FormDevtoolsEventMap & string

interface FormDevtoolsEvent<TEventName extends FormDevtoolsEventName> {
  type: string
  payload: FormDevtoolsEventMap[TEventName]
  pluginId?: string
}

const localEventTarget = new EventTarget()

function getEventType<TEventName extends FormDevtoolsEventName>(
  eventName: TEventName,
) {
  return `${formDevtoolsEventClient.getPluginId()}:${eventName}` as const
}

export function emitFormDevtoolsEvent<
  TEventName extends FormDevtoolsEventName,
>(
  eventName: TEventName,
  payload: FormDevtoolsEventMap[TEventName],
): void {
  formDevtoolsEventClient.emit(eventName, payload)
  localEventTarget.dispatchEvent(
    new CustomEvent(getEventType(eventName), {
      detail: formDevtoolsEventClient.createEventPayload(eventName, payload),
    }),
  )
}

export function onFormDevtoolsEvent<TEventName extends FormDevtoolsEventName>(
  eventName: TEventName,
  cb: (event: FormDevtoolsEvent<TEventName>) => void,
): () => void {
  const eventType = getEventType(eventName)
  const localHandler = (event: Event) => {
    cb((event as CustomEvent<FormDevtoolsEvent<TEventName>>).detail)
  }
  const unsubscribeBus = formDevtoolsEventClient.on(eventName, cb)

  localEventTarget.addEventListener(eventType, localHandler)

  return () => {
    unsubscribeBus()
    localEventTarget.removeEventListener(eventType, localHandler)
  }
}
