import { render } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldDetailSettingsActions } from '../src/components/fields/fieldDetails/FieldDetailSettingsActions'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  FieldActionRequest,
  FormDevtoolsEventMap,
} from '../src/eventClientTypes'
import type { FieldId, FormId } from '../src/types/branded'

const disposers: Array<() => void> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
})

describe('FieldDetailSettingsActions', () => {
  it('requests each field action for the displayed field', async () => {
    const disconnectEventBus = connectTestEventBus()
    const requests: Array<{
      eventName: keyof FormDevtoolsEventMap
      payload: FieldActionRequest
    }> = []
    const actionEvents = [
      'field-handle-change-request',
      'field-handle-blur-request',
      'field-reset-request',
    ] as const
    const cleanups = actionEvents.map((eventName) =>
      formDevtoolsEventClient.on(eventName, (event) => {
        requests.push({ eventName, payload: event.payload })
      }),
    )
    const container = document.createElement('div')
    document.body.append(container)
    const formInstanceId = 'form-a' as FormId
    const fieldId = 'field-a' as FieldId
    const dispose = render(
      () => (
        <FieldDetailSettingsActions
          formInstanceId={formInstanceId}
          fieldId={fieldId}
        />
      ),
      container,
    )
    disposers.push(dispose, disconnectEventBus, ...cleanups, () => {
      document.body.querySelector('[role="menu"]')?.remove()
      container.remove()
    })

    const selectAction = async (label: string) => {
      const trigger = container.querySelector<HTMLButtonElement>(
        'button[aria-label="Emit event"]',
      )
      expect(trigger).not.toBeNull()
      trigger!.click()

      await vi.waitFor(() => {
        const openMenu = document.body.querySelector(
          '[role="menu"][data-state="open"]',
        )
        expect(
          Array.from(
            openMenu?.querySelectorAll('[role="menuitem"]') ?? [],
          ).find((item) => item.textContent.includes(label)),
        ).not.toBeUndefined()
      })

      const openMenu = document.body.querySelector(
        '[role="menu"][data-state="open"]',
      )
      const item = Array.from(
        openMenu?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
      ).find((candidate) => candidate.textContent.includes(label))
      expect(item).not.toBeUndefined()
      item!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      item!.click()
    }

    await selectAction('.handleChange(')
    await selectAction('.handleBlur()')
    await selectAction('.reset()')

    expect(requests).toEqual(
      actionEvents.map((eventName) => ({
        eventName,
        payload: { formInstanceId, fieldId },
      })),
    )
  })
})
