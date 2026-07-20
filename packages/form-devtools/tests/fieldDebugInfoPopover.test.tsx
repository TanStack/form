import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FieldNoErrorsItem } from '../src/components/fields/fieldDetails/fieldErrors/FieldNoErrorsItem'
import { PortalProvider } from '../src/components/ui/portal'
import type {
  FieldDebugReport,
  FieldDebugReportRequest,
  FieldDebugSuspicion,
} from '../src/eventClientTypes'

const debugRequests = vi.hoisted(
  () =>
    [] as Array<{
      target: Omit<FieldDebugReportRequest, 'requestId'>
      onReport: (report: FieldDebugReport) => void
      cancel: ReturnType<typeof vi.fn>
    }>,
)

vi.mock('../src/debugReports', () => ({
  requestFieldDebugReport: vi.fn(
    (
      target: Omit<FieldDebugReportRequest, 'requestId'>,
      onReport: (report: FieldDebugReport) => void,
    ) => {
      const cancel = vi.fn()
      debugRequests.push({ target, onReport, cancel })
      return cancel
    },
  ),
}))

const suspicion = {
  kind: 'schema-errors-on-unmounted-descendants',
  evidence: {
    fieldPath: 'dateRange',
    unmountedDescendantPaths: ['dateRange.start', 'dateRange.end'],
  },
} satisfies FieldDebugSuspicion

const disposers: Array<() => void> = []

beforeEach(() => {
  debugRequests.splice(0)
})

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
})

function renderNoErrorsItem() {
  const container = document.createElement('div')
  document.body.append(container)

  const dispose = render(
    () => (
      <PortalProvider>
        <FieldNoErrorsItem formInstanceId="form-a" fieldId="field-name" />
      </PortalProvider>
    ),
    container,
  )
  disposers.push(() => {
    dispose()
    container.remove()
  })

  const debugTrigger = container.querySelector<HTMLElement>(
    '[aria-label="Debug field"]',
  )!

  const respond = async (
    report: Omit<FieldDebugReport, 'requestId'> = {
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

describe('field debug info popover', () => {
  it('requests field guidance, renders aggregated paths, and retains dismissals', async () => {
    const { content, debugTrigger, dismiss, respond } = renderNoErrorsItem()

    expect(content()).toContain('No errors')
    debugTrigger.click()
    await Promise.resolve()
    expect(debugRequests).toHaveLength(1)
    expect(debugRequests[0]!.target).toEqual({
      formInstanceId: 'form-a',
      fieldId: 'field-name',
    })
    expect(content()).toContain('Investigating this field')

    await respond()
    expect(content()).toContain('Schema errors in unmounted fields')
    expect(content()).toContain('dateRange.start')
    expect(content()).toContain('dateRange.end')

    await dismiss()
    expect(content()).not.toContain('Schema errors in unmounted fields')
    expect(content()).toContain(
      'The only patterns related to this field are no longer considered relevant',
    )

    debugTrigger.click()
    await Promise.resolve()
    debugTrigger.click()
    await Promise.resolve()
    expect(debugRequests).toHaveLength(1)
  })

  it('shows the field-specific empty state', async () => {
    const { content, debugTrigger, respond } = renderNoErrorsItem()

    debugTrigger.click()
    await Promise.resolve()
    await respond({ suspicions: [] })

    expect(content()).toContain(
      "We couldn't find anything unusual that would help explain why this field has no errors",
    )
  })
})
