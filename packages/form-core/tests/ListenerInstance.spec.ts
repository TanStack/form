import { describe, expect, it, vi } from 'vitest'
import { ListenerInstance } from '../src/pipeline/listeners/ListenerInstance.lib'
import type { AnyFieldListener } from '../src/pipeline/listeners/listeners.public'

function createDefinition(label: string): AnyFieldListener {
  return {
    triggers: ['change'],
    run: () => label,
  }
}

describe('ListenerInstance', () => {
  it('updates its definition without replacing runtime identity', () => {
    const initialDefinition = createDefinition('initial')
    const instance = new ListenerInstance({
      definition: initialDefinition,
      scope: 'field',
    })
    const nextDefinition = createDefinition('next')

    instance.updateDefinition(nextDefinition)

    expect(instance.definition).toBe(nextDefinition)
  })
})

describe('ListenerInstance.update', () => {
  it('normalizes empty definitions and runs owner cleanup', () => {
    const instances = ListenerInstance.update({
      definitions: [createDefinition('listener')],
      instances: null,
      scope: 'field',
    })
    const instance = instances![0]!
    const onBeforeDispose = vi.fn()

    expect(
      ListenerInstance.update({
        definitions: [],
        instances,
        scope: 'field',
        onBeforeDispose,
      }),
    ).toBeNull()
    expect(onBeforeDispose).toHaveBeenCalledWith(instance)
    expect(instance.disposed).toBe(true)
  })
})
