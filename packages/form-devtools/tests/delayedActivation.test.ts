import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDelayedActivationController } from '../src/bridge/fields/delayedActivation'

afterEach(() => {
  vi.useRealTimers()
})

describe('delayed activation', () => {
  it('batches due keys without restarting repeated observations', async () => {
    vi.useFakeTimers()
    const changes: Array<[string, boolean]> = []
    const controller = createDelayedActivationController<string>({
      delayMs: 300,
      canActivate: () => true,
      onChange: (key, active) => changes.push([key, active]),
    })

    controller.observe('parent', true)
    controller.observe('child', true)
    expect(vi.getTimerCount()).toBe(1)

    await vi.advanceTimersByTimeAsync(150)
    controller.observe('child', true)
    await vi.advanceTimersByTimeAsync(149)
    expect(changes).toEqual([])

    await vi.advanceTimersByTimeAsync(1)
    expect(changes).toEqual([
      ['parent', true],
      ['child', true],
    ])

    controller.observe('child', false)
    expect(changes.at(-1)).toEqual(['child', false])
    expect(controller.isActive('child')).toBe(false)
    controller.dispose()
  })

  it('silently cancels pending keys during lifecycle cleanup', async () => {
    vi.useFakeTimers()
    const changes: Array<[string, boolean]> = []
    const controller = createDelayedActivationController<string>({
      delayMs: 300,
      canActivate: (key) => key !== 'ineligible',
      onChange: (key, active) => changes.push([key, active]),
    })

    controller.observe('removed', true)
    controller.remove('removed')
    expect(vi.getTimerCount()).toBe(0)

    controller.observe('form-a', true)
    controller.observe('form-b', true)
    controller.removeWhere((key) => key === 'form-a')
    expect(vi.getTimerCount()).toBe(1)

    controller.observe('ineligible', true)
    await vi.advanceTimersByTimeAsync(300)
    expect(changes).toEqual([['form-b', true]])

    controller.observe('pending', true)
    expect(vi.getTimerCount()).toBe(1)
    controller.dispose()
    expect(vi.getTimerCount()).toBe(0)
    expect(changes).toEqual([['form-b', true]])
  })
})
