import { describe, expect, it, vi } from 'vitest'
import {
  InternalListenerInstance,
  reconcileListenerInstances,
} from '../src/ListenerInstance.lib'
import type { AnyFieldListener } from '../src/listeners.public'

function createDefinition(label: string): AnyFieldListener {
  return {
    triggers: ['change'],
    run: () => label,
  }
}

describe('InternalListenerInstance', () => {
  it('updates its definition without replacing runtime identity', () => {
    const owner = { name: 'field' }
    const initialDefinition = createDefinition('initial')
    const instance = new InternalListenerInstance({
      definition: initialDefinition,
      owner,
      index: 2,
    })
    const source = { name: 'source' }
    const nextDefinition = createDefinition('next')

    instance.setResolvedWatchField('source', source)
    instance.updateDefinition(nextDefinition)

    expect(instance.definition).toBe(nextDefinition)
    expect(instance.owner).toBe(owner)
    expect(instance.index).toBe(2)
    expect(instance.revision).toBe(1)
    expect(instance.resolvedWatchFields?.get('source')).toBe(source)
  })

  it('resets and disposes pending execution safely', async () => {
    vi.useFakeTimers()
    const instance = new InternalListenerInstance({
      definition: createDefinition('listener'),
      owner: {},
    })
    const run = vi.fn((_value: string) => {})
    const debouncer = instance.getOrCreateDebouncer(run, 100)
    debouncer?.maybeExecute('cancelled')

    instance.resetRuntime()
    await vi.advanceTimersByTimeAsync(100)

    expect(run).not.toHaveBeenCalled()
    expect(instance.debouncer).toBeNull()
    expect(instance.disposed).toBe(false)

    instance.setResolvedWatchField('source', {})
    const onBeforeDispose = vi.fn()
    instance.dispose(onBeforeDispose)
    instance.dispose(onBeforeDispose)

    expect(onBeforeDispose).toHaveBeenCalledOnce()
    expect(instance.resolvedWatchFields).toBeNull()
    expect(instance.disposed).toBe(true)
    expect(instance.getOrCreateDebouncer(run, 100)).toBeNull()
    vi.useRealTimers()
  })
})

describe('reconcileListenerInstances', () => {
  it('preserves retained slots and disposes removed slots', () => {
    const owner = { name: 'field' }
    const initial = reconcileListenerInstances({
      definitions: [createDefinition('first'), createDefinition('second')],
      instances: null,
      owner,
    })
    const firstInstance = initial![0]!
    const secondInstance = initial![1]!
    const nextDefinition = createDefinition('next')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const next = reconcileListenerInstances({
      definitions: [nextDefinition],
      previousDefinitions: initial!.map((instance) => instance.definition),
      instances: initial,
      owner,
    })

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('length of the listener array should not change'),
    )
    expect(next).toBe(initial)
    expect(next).toEqual([firstInstance])
    expect(firstInstance.definition).toBe(nextDefinition)
    expect(firstInstance.revision).toBe(1)
    expect(secondInstance.disposed).toBe(true)
    warn.mockRestore()
  })

  it('normalizes empty definitions and runs owner cleanup', () => {
    const owner = { name: 'form' }
    const instances = reconcileListenerInstances({
      definitions: [createDefinition('listener')],
      instances: null,
      owner,
    })
    const instance = instances![0]!
    const onBeforeDispose = vi.fn()

    expect(
      reconcileListenerInstances({
        definitions: [],
        instances,
        owner,
        onBeforeDispose,
      }),
    ).toBeNull()
    expect(onBeforeDispose).toHaveBeenCalledWith(instance)
    expect(instance.disposed).toBe(true)
  })
})
