import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useEffect, useRef } from 'react'

// Capture the most-recently-constructed FormDevtoolsCore so the test can
// assert mount/unmount call order without needing to know the prop object
// identity React passes to the effect.
const lastInstance = vi.hoisted(() => ({ current: null as null | { mount: ReturnType<typeof vi.fn>; unmount: ReturnType<typeof vi.fn> } }))

vi.mock('@tanstack/form-devtools', () => {
  class MockFormDevtoolsCore {
    mount = vi.fn()
    unmount = vi.fn()
    constructor() {
      lastInstance.current = this
    }
  }
  return { FormDevtoolsCore: MockFormDevtoolsCore }
})

// Re-import after the mock is registered.
const { FormDevtoolsPanel } = await import('../src/FormDevtools')

beforeEach(() => {
  lastInstance.current = null
})

describe('FormDevtoolsPanel — integration with @testing-library/react + jsdom', () => {
  it('mounts FormDevtoolsCore on initial render with the given theme', () => {
    const { unmount } = render(<FormDevtoolsPanel theme="dark" />)

    expect(lastInstance.current).not.toBeNull()
    expect(lastInstance.current!.mount).toHaveBeenCalledTimes(1)
    expect(lastInstance.current!.unmount).not.toHaveBeenCalled()
    expect(lastInstance.current!.mount).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      expect.objectContaining({ theme: 'dark' }),
    )

    unmount()
  })

  it('does NOT remount when an unrelated prop changes but theme stays the same', () => {
    // Wrap in a parent that we control so we can force prop-identity changes
    // without changing theme.
    function Harness({ extras }: { extras: object }) {
      return <FormDevtoolsPanel theme="dark" {...extras} />
    }

    const { rerender, unmount } = render(<Harness extras={{ a: 1 }} />)
    const firstInstance = lastInstance.current
    expect(firstInstance?.mount).toHaveBeenCalledTimes(1)

    // Re-render with a new prop object — same theme.
    rerender(<Harness extras={{ a: 2 }} />)

    // Same instance, no remount, no unmount.
    expect(lastInstance.current).toBe(firstInstance)
    expect(firstInstance!.mount).toHaveBeenCalledTimes(1)
    expect(firstInstance!.unmount).not.toHaveBeenCalled()

    unmount()
  })

  it('unmounts the old instance and mounts a new one when theme changes', () => {
    const { rerender, unmount } = render(<FormDevtoolsPanel theme="light" />)
    const lightInstance = lastInstance.current
    expect(lightInstance?.mount).toHaveBeenCalledTimes(1)
    expect(lightInstance?.mount).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      expect.objectContaining({ theme: 'light' }),
    )

    rerender(<FormDevtoolsPanel theme="dark" />)

    // After theme change: old instance unmounted, new instance mounted.
    expect(lightInstance!.unmount).toHaveBeenCalledTimes(1)
    const darkInstance = lastInstance.current
    expect(darkInstance).not.toBe(lightInstance)
    expect(darkInstance?.mount).toHaveBeenCalledTimes(1)
    expect(darkInstance!.mount).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      expect.objectContaining({ theme: 'dark' }),
    )
    expect(darkInstance!.unmount).not.toHaveBeenCalled()

    unmount()
  })

  it('unmounts the current FormDevtoolsCore when the panel itself unmounts', () => {
    const { unmount } = render(<FormDevtoolsPanel theme="dark" />)
    const instance = lastInstance.current
    expect(instance?.unmount).not.toHaveBeenCalled()

    unmount()

    // The cleanup function on the live effect must call unmount exactly once.
    expect(instance!.unmount).toHaveBeenCalledTimes(1)
  })

  it('returns null from FormDevtoolsPanelNoOp without mounting any core', async () => {
    const { FormDevtoolsPanelNoOp } = await import('../src/FormDevtools')
    lastInstance.current = null

    const { container, unmount } = render(<FormDevtoolsPanelNoOp theme="dark" />)

    expect(lastInstance.current).toBeNull()
    expect(container.firstChild).toBeNull()

    unmount()
  })
})
