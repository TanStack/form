import { createMemo, createSignal } from 'solid-js'
import type { DevtoolsMountedForm } from '@/eventClientTypes'
import type { FormId } from '@/types/branded'
import { formDevtoolsEventClient } from '@/eventClient.lib'

export const [mountedForms, setMountedForms] = createSignal<
  Array<DevtoolsMountedForm>
>([])

export const [requestedFormId, setRequestedFormId] =
  createSignal<FormId | null>(null)

export const selectedForm = createMemo<DevtoolsMountedForm | null>(() => {
  const opts = mountedForms()
  const requestedId = requestedFormId()

  const fallbackChoice = opts[0]
  // No form is mounted, so there's no possible selection.
  // Also serves as array length check for `.some` below
  if (!fallbackChoice) return null

  if (requestedId === null) return fallbackChoice

  // The user selected form may be (temporarily) unmounted and nonexistent, so don't preserve it
  return opts.find((opt) => opt.instanceId === requestedId) ?? fallbackChoice
})

export function mountFormSelectorEvents(): () => void {
  const cleanup = formDevtoolsEventClient.on('mounted-forms-changed', (event) =>
    setMountedForms(event.payload.forms),
  )

  formDevtoolsEventClient.emit('request-mounted-forms', {})

  return cleanup
}
