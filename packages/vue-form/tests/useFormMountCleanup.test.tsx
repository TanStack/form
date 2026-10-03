import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent } from 'vue'
import { useForm } from '../src'

/**
 * `FormApi.mount()` registers listeners on `window` through the devtools event
 * client and returns a teardown function. Vue ignores a value returned from
 * `onMounted`, so the adapter has to hold that teardown and call it from
 * `onUnmounted` — otherwise every mounted form leaks its listeners for the
 * lifetime of the document.
 */
describe('useForm mount cleanup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('removes the listeners registered by mount() when the form unmounts', async () => {
    const added: Array<string> = []
    const removed: Array<string> = []

    vi.spyOn(window, 'addEventListener').mockImplementation(((
      type: string,
    ) => {
      added.push(type)
    }) as never)
    vi.spyOn(window, 'removeEventListener').mockImplementation(((
      type: string,
    ) => {
      removed.push(type)
    }) as never)

    const Comp = defineComponent(() => {
      useForm({ defaultValues: { firstName: '' } })
      return () => <div>form</div>
    })

    const { unmount } = render(<Comp />)
    expect(added.length).toBeGreaterThan(0)

    unmount()

    // Every listener type registered on mount must be taken back off.
    for (const type of new Set(added)) {
      expect(removed).toContain(type)
    }
  })

  it('does not accumulate listeners across repeated mounts', async () => {
    const live = new Map<string, number>()

    vi.spyOn(window, 'addEventListener').mockImplementation(((
      type: string,
    ) => {
      live.set(type, (live.get(type) ?? 0) + 1)
    }) as never)
    vi.spyOn(window, 'removeEventListener').mockImplementation(((
      type: string,
    ) => {
      live.set(type, (live.get(type) ?? 0) - 1)
    }) as never)

    const Comp = defineComponent(() => {
      useForm({ defaultValues: { firstName: '' } })
      return () => <div>form</div>
    })

    for (let i = 0; i < 3; i++) {
      const { unmount } = render(<Comp />)
      unmount()
    }

    for (const [, count] of live) {
      expect(count).toBe(0)
    }
  })
})
