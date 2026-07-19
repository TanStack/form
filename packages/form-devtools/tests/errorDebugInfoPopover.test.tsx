import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FieldDetailErrorItem } from '../src/components/fields/fieldDetails/fieldErrors/FieldDetailErrorItem'
import { PortalProvider } from '../src/components/ui/portal'
import { FormDevtoolsStoreProvider } from '../src/stores/formDevtoolsStore'
import type {
  DevtoolsFieldError,
  FieldErrorDebugReport,
} from '../src/eventClientTypes'

const debugRequests = vi.hoisted(
  () =>
    [] as Array<{
      onReport: (report: FieldErrorDebugReport) => void
      cancel: ReturnType<typeof vi.fn>
    }>,
)

vi.mock('../src/debugReports', () => ({
  requestFieldErrorDebugReport: vi.fn(
    (_target, onReport: (report: FieldErrorDebugReport) => void) => {
      const cancel = vi.fn()
      debugRequests.push({ onReport, cancel })
      return cancel
    },
  ),
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

const suspicion = {
  kind: 'schema-error-on-unmounted-field',
  evidence: {
    fieldPath: 'grandparent.parent.child',
    mountedAncestorPath: 'grandparent',
  },
} as const

const disposers: Array<() => void> = []

beforeEach(() => {
  debugRequests.splice(0)
})

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
            formInstanceId="form-a"
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

  const respond = async (
    report: Omit<FieldErrorDebugReport, 'requestId'> = {
      suspicions: [suspicion],
    },
  ) => {
    const request = debugRequests.at(-1)
    expect(request).toBeDefined()
    request!.onReport({ requestId: 'request', ...report })
    await Promise.resolve()
  }

  const dismiss = async () => {
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-slot="button"]'),
    ).find((candidate) => candidate.textContent.trim() === 'Not useful')
    expect(button).toBeDefined()
    button!.click()
    await Promise.resolve()
  }

  return {
    debugTrigger,
    dismiss,
    respond,
    content: () => document.body.textContent,
  }
}

describe('error debug info popover', () => {
  it('requests a report, renders typed evidence, and retains dismissals', async () => {
    const { content, debugTrigger, dismiss, respond } = renderErrorItem()

    debugTrigger.click()
    await Promise.resolve()
    expect(debugRequests).toHaveLength(1)
    expect(content()).toContain('Investigating this error')

    await respond()
    expect(content()).toContain('Schema error in unmounted field')
    expect(content()).toContain('grandparent.parent.child')
    expect(content()).toContain('grandparent')

    await dismiss()
    expect(content()).not.toContain('Schema error in unmounted field')
    expect(content()).toContain(
      'The only patterns related to this error are no longer considered relevant',
    )

    debugTrigger.click()
    await Promise.resolve()
    debugTrigger.click()
    await Promise.resolve()
    expect(debugRequests).toHaveLength(1)
    expect(content()).not.toContain('Schema error in unmounted field')
  })

  it('shows the generic empty state and resets dismissals on remount', async () => {
    const empty = renderErrorItem()
    empty.debugTrigger.click()
    await Promise.resolve()
    await empty.respond({ suspicions: [] })
    expect(empty.content()).toContain(
      "We couldn't find anything unusual that would help explain this error",
    )

    disposers.pop()?.()
    debugRequests.splice(0)

    const next = renderErrorItem()
    next.debugTrigger.click()
    await Promise.resolve()
    await next.respond()
    expect(next.content()).toContain('Schema error in unmounted field')
  })
})
