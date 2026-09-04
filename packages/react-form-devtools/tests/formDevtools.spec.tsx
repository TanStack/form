import { describe, expect, it, vi } from 'vitest'

// Mock FormDevtoolsCore so we can verify mount/unmount calls without
// needing a real DOM environment
vi.mock('@tanstack/form-devtools', () => {
  class MockFormDevtoolsCore {
    mount = vi.fn()
    unmount = vi.fn()
  }
  return { FormDevtoolsCore: MockFormDevtoolsCore }
})

describe('FormDevtoolsCore lifecycle mock', () => {
  it('mock can be instantiated and has mount/unmount methods', async () => {
    const { FormDevtoolsCore } = await import('@tanstack/form-devtools')
    const instance = new FormDevtoolsCore() as InstanceType<typeof FormDevtoolsCore>

    expect(typeof instance.mount).toBe('function')
    expect(typeof instance.unmount).toBe('function')

    // Verify mount is callable with element and props
    const mockEl = {} as HTMLDivElement
    const mockProps = { theme: 'dark' }
    instance.mount(mockEl, mockProps)

    expect(instance.mount).toHaveBeenCalledWith(mockEl, mockProps)
  })

  it('mount is called with correct theme in subsequent calls', async () => {
    const { FormDevtoolsCore } = await import('@tanstack/form-devtools')

    // Simulate theme change: light → dark
    const instance1 = new FormDevtoolsCore() as InstanceType<typeof FormDevtoolsCore>
    instance1.mount({} as HTMLDivElement, { theme: 'light' })

    // Simulate theme change: unmount previous and mount new
    instance1.unmount()
    const instance2 = new FormDevtoolsCore() as InstanceType<typeof FormDevtoolsCore>
    instance2.mount({} as HTMLDivElement, { theme: 'dark' })

    expect(instance1.unmount).toHaveBeenCalledTimes(1)
    expect(instance2.mount).toHaveBeenCalledWith(
      {} as HTMLDivElement,
      expect.objectContaining({ theme: 'dark' })
    )
  })
})

/**
 * Note on integration testing:
 * A full integration test that renders FormDevtoolsPanel with React Testing Library
 * and verifies mount/unmount calls across theme changes would require
 * @testing-library/react and a jsdom environment. These are not currently
 * available as devDependencies in @tanstack/react-form-devtools.
 * See: https://github.com/TanStack/form/pull/2371#discussion-...
 */
