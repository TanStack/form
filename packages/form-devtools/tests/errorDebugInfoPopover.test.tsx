import { render } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldDetailErrorItem } from '../src/components/fields/fieldDetails/fieldErrors/FieldDetailErrorItem'
import { PortalProvider } from '../src/components/ui/portal'
import { FormDevtoolsStoreProvider } from '../src/stores/formDevtoolsStore'
import type { DevtoolsFieldError } from '../src/eventClientTypes'

vi.mock('../src/components/fields/fieldDetails/fieldErrors/debugCases', () => ({
  fieldErrorDebugCases: [
    {
      evaluate: () => ({
        title: 'First debug tip',
        description: 'First description',
        commonCase: 'First common case',
        fixes: [],
      }),
    },
    {
      evaluate: () => ({
        title: 'Second debug tip',
        description: 'Second description',
        commonCase: 'Second common case',
        fixes: [],
      }),
    },
  ],
}))

const error = {
  error: { message: 'Schema error' },
  source: {
    scope: 'field',
    validatorIndex: 0,
    validatorType: 'schema',
  },
  sourceEvent: 'change',
} satisfies DevtoolsFieldError

const disposers: Array<() => void> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
})

function renderErrorItem() {
  const container = document.createElement('div')
  document.body.append(container)

  const dispose = render(
    () => (
      <PortalProvider>
        <FormDevtoolsStoreProvider>
          <FieldDetailErrorItem
            fieldId="field-name"
            error={error}
            hasHiddenErrors={() => false}
          />
        </FormDevtoolsStoreProvider>
      </PortalProvider>
    ),
    container,
  )
  disposers.push(() => {
    dispose()
    container.remove()
  })

  const triggers = container.querySelectorAll<HTMLElement>(
    '[data-slot="popover-trigger"]',
  )
  const debugTrigger = triggers.item(1)

  const dismiss = async () => {
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-slot="button"]'),
    ).find((candidate) => candidate.textContent.trim() === 'Not useful')
    expect(button).toBeDefined()
    button!.click()
    await Promise.resolve()
  }

  return {
    container,
    debugTrigger,
    dismiss,
    content: () => document.body.textContent,
  }
}

describe('error debug info popover', () => {
  it('advances through tips and retains dismissals while the item is mounted', async () => {
    const { content, debugTrigger, dismiss } = renderErrorItem()

    debugTrigger.click()
    await Promise.resolve()
    expect(content()).toContain('First debug tip')
    expect(content()).not.toContain('Second debug tip')

    await dismiss()
    expect(content()).not.toContain('First debug tip')
    expect(content()).toContain('Second debug tip')

    debugTrigger.click()
    await Promise.resolve()
    debugTrigger.click()
    await Promise.resolve()
    expect(content()).not.toContain('First debug tip')
    expect(content()).toContain('Second debug tip')

    await dismiss()
    expect(content()).not.toContain('Second debug tip')
    expect(content()).toContain(
      'The only patterns related to this error are no longer considered relevant',
    )
  })

  it('resets dismissed tips when the error item remounts', async () => {
    const first = renderErrorItem()
    first.debugTrigger.click()
    await Promise.resolve()
    await first.dismiss()
    expect(first.content()).toContain('Second debug tip')

    disposers.pop()?.()

    const second = renderErrorItem()
    second.debugTrigger.click()
    await Promise.resolve()
    expect(second.content()).toContain('First debug tip')
    expect(second.content()).not.toContain('Second debug tip')
  })
})
