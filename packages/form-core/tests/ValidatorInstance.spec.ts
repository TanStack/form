import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { LiteDebouncer } from '@tanstack/pacer-lite'
import {
  InternalValidatorInstance,
  reconcileValidatorInstances,
} from '../src/ValidatorInstance.lib'

type TestDebouncedFn = (value: string) => void

const createDefinition = (message: string) => ({
  run: () => ({ message }),
  triggers: ['change'] as const,
})

function createInstance() {
  const definition = createDefinition('initial')
  const owner = { name: 'name' as const }

  return new InternalValidatorInstance<
    typeof definition,
    typeof owner,
    string,
    { name: string },
    string | undefined,
    TestDebouncedFn
  >({
    definition,
    owner,
    scope: 'field',
  })
}

describe('InternalValidatorInstance', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stores its installation and starts with empty runtime state', () => {
    const first = createInstance()
    const second = createInstance()

    expect(first).not.toBe(second)
    expect(first.definition.run()).toEqual({ message: 'initial' })
    expect(first.owner).toEqual({ name: 'name' })
    expect(first.scope).toBe('field')
    expect(first.abortController).toBeNull()
    expect(first.debouncer).toBeNull()
    expect(first.schemaOutput).toBeUndefined()
    expect(first.hasSchemaOutput).toBe(false)
    expect(first.errorTargets).toBeNull()
    expect(first.resolvedWatchFields).toBeNull()
    expect(first.didRunOnMount).toBe(false)
    expect(first.revision).toBe(0)
    expect(first.disposed).toBe(false)

    first.addErrorTarget('temporary')
    first.deleteErrorTarget('temporary')
    first.setResolvedWatchField('temporary', { name: 'temporary' })
    first.deleteResolvedWatchField('temporary')

    expectTypeOf(first.definition).toEqualTypeOf<
      ReturnType<typeof createDefinition>
    >()
    expectTypeOf(first.owner).toEqualTypeOf<{ name: 'name' }>()
    expectTypeOf(first.errorTargets).toEqualTypeOf<Set<string> | null>()
    expectTypeOf(first.resolvedWatchFields).toEqualTypeOf<Map<
      string,
      { name: string }
    > | null>()
    expectTypeOf(first.schemaOutput).toEqualTypeOf<string | undefined>()
    expectTypeOf(
      first.debouncer,
    ).toEqualTypeOf<LiteDebouncer<TestDebouncedFn> | null>()
  })

  it('updates its definition without disturbing other state', () => {
    const instance = createInstance()
    const initialDefinition = instance.definition
    const abortController = new AbortController()
    const debouncedFn = vi.fn((_value: string) => {})
    const debouncer = instance.getOrCreateDebouncer(debouncedFn, 100)
    const watchedField = { name: 'source' }

    instance.setAbortController(abortController)
    instance.setSchemaOutput('output')
    instance.addErrorTarget('target')
    instance.setResolvedWatchField('source', watchedField)
    instance.markMountValidationRan()

    instance.updateDefinition(initialDefinition)
    expect(instance.revision).toBe(1)

    const nextDefinition = createDefinition('updated')
    instance.updateDefinition(nextDefinition)

    expect(instance.definition).toBe(nextDefinition)
    expect(instance.revision).toBe(2)
    expect(instance.abortController).toBe(abortController)
    expect(instance.debouncer).toBe(debouncer)
    expect(instance.schemaOutput).toBe('output')
    expect(instance.hasSchemaOutput).toBe(true)
    expect(instance.errorTargets).toEqual(new Set(['target']))
    expect(instance.resolvedWatchFields?.get('source')).toBe(watchedField)
    expect(instance.didRunOnMount).toBe(true)
    expect(abortController.signal.aborted).toBe(false)
  })

  it('owns abort-controller replacement and clearing', () => {
    const instance = createInstance()
    const firstController = new AbortController()
    const secondController = new AbortController()

    instance.setAbortController(firstController)
    instance.setAbortController(secondController)
    expect(firstController.signal.aborted).toBe(true)
    expect(instance.abortController).toBe(secondController)

    instance.clearAbortController(firstController)
    expect(instance.abortController).toBe(secondController)
    instance.clearAbortController(secondController)
    expect(instance.abortController).toBeNull()
    expect(secondController.signal.aborted).toBe(false)
  })

  it('creates, reconfigures, and cancels a pacer-lite debouncer', async () => {
    vi.useFakeTimers()
    const instance = createInstance()
    const firstFn = vi.fn((_value: string) => {})
    const secondFn = vi.fn((_value: string) => {})

    const debouncer = instance.getOrCreateDebouncer(firstFn, 100)
    expect(debouncer).toBeInstanceOf(LiteDebouncer)
    expect(instance.debouncer).toBe(debouncer)
    debouncer?.maybeExecute('first')

    const reconfigured = instance.getOrCreateDebouncer(secondFn, 200)
    expect(reconfigured).toBe(debouncer)
    expect(reconfigured?.fn).toBe(secondFn)
    expect(reconfigured?.options.wait).toBe(200)
    reconfigured?.maybeExecute('second')

    await vi.advanceTimersByTimeAsync(199)
    expect(firstFn).not.toHaveBeenCalled()
    expect(secondFn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(firstFn).not.toHaveBeenCalled()
    expect(secondFn).toHaveBeenCalledOnce()
    expect(secondFn).toHaveBeenCalledWith('second')

    reconfigured?.maybeExecute('cancelled')
    instance.cancelExecution()
    await vi.advanceTimersByTimeAsync(200)

    expect(secondFn).toHaveBeenCalledOnce()
    expect(instance.debouncer).toBeNull()
  })

  it('distinguishes an unset schema output from an undefined output', () => {
    const instance = createInstance()

    instance.setSchemaOutput(undefined)
    expect(instance.schemaOutput).toBeUndefined()
    expect(instance.hasSchemaOutput).toBe(true)

    instance.clearSchemaOutput()
    expect(instance.schemaOutput).toBeUndefined()
    expect(instance.hasSchemaOutput).toBe(false)
  })

  it('resets runtime state while preserving its installation', async () => {
    vi.useFakeTimers()
    const instance = createInstance()
    const definition = createDefinition('updated')
    const owner = instance.owner
    const abortController = new AbortController()
    const debouncedFn = vi.fn((_value: string) => {})
    const watchedField = { name: 'source' }

    instance.updateDefinition(definition)
    instance.setAbortController(abortController)
    const debouncer = instance.getOrCreateDebouncer(debouncedFn, 100)
    instance.setSchemaOutput('output')
    instance.addErrorTarget('target')
    instance.setResolvedWatchField('source', watchedField)
    instance.markMountValidationRan()
    debouncer?.maybeExecute('cancelled')

    instance.resetRuntime()
    await vi.advanceTimersByTimeAsync(100)

    expect(abortController.signal.aborted).toBe(true)
    expect(debouncedFn).not.toHaveBeenCalled()
    expect(instance.abortController).toBeNull()
    expect(instance.debouncer).toBeNull()
    expect(instance.schemaOutput).toBeUndefined()
    expect(instance.hasSchemaOutput).toBe(false)
    expect(instance.errorTargets).toBeNull()
    expect(instance.resolvedWatchFields?.get('source')).toBe(watchedField)
    expect(instance.didRunOnMount).toBe(true)
    expect(instance.definition).toBe(definition)
    expect(instance.owner).toBe(owner)
    expect(instance.scope).toBe('field')
    expect(instance.revision).toBe(1)
    expect(instance.disposed).toBe(false)
  })

  it('disposes once and ignores later mutations', async () => {
    vi.useFakeTimers()
    const instance = createInstance()
    const definition = instance.definition
    const abortController = new AbortController()
    const debouncedFn = vi.fn((_value: string) => {})

    instance.setAbortController(abortController)
    const debouncer = instance.getOrCreateDebouncer(debouncedFn, 100)
    instance.setSchemaOutput('output')
    instance.addErrorTarget('target')
    instance.setResolvedWatchField('source', { name: 'source' })
    instance.markMountValidationRan()
    debouncer?.maybeExecute('cancelled')

    instance.dispose()
    instance.dispose()
    await vi.advanceTimersByTimeAsync(100)

    expect(abortController.signal.aborted).toBe(true)
    expect(debouncedFn).not.toHaveBeenCalled()
    expect(instance.abortController).toBeNull()
    expect(instance.debouncer).toBeNull()
    expect(instance.schemaOutput).toBeUndefined()
    expect(instance.hasSchemaOutput).toBe(false)
    expect(instance.errorTargets).toBeNull()
    expect(instance.resolvedWatchFields).toBeNull()
    expect(instance.didRunOnMount).toBe(false)
    expect(instance.disposed).toBe(true)

    const nextController = new AbortController()
    const nextDebouncedFn = vi.fn((_value: string) => {})
    instance.updateDefinition(createDefinition('ignored'))
    instance.setAbortController(nextController)
    instance.clearAbortController(nextController)
    const nextDebouncer = instance.getOrCreateDebouncer(nextDebouncedFn, 100)
    instance.setSchemaOutput('ignored')
    instance.clearSchemaOutput()
    instance.addErrorTarget('ignored')
    instance.deleteErrorTarget('target')
    instance.setResolvedWatchField('ignored', { name: 'ignored' })
    instance.deleteResolvedWatchField('source')
    instance.markMountValidationRan()
    instance.cancelExecution()
    instance.resetRuntime()

    expect(instance.definition).toBe(definition)
    expect(instance.revision).toBe(0)
    expect(instance.abortController).toBeNull()
    expect(instance.debouncer).toBeNull()
    expect(instance.hasSchemaOutput).toBe(false)
    expect(instance.errorTargets).toBeNull()
    expect(instance.resolvedWatchFields).toBeNull()
    expect(instance.didRunOnMount).toBe(false)
    expect(nextController.signal.aborted).toBe(false)
    expect(nextDebouncer).toBeNull()
  })
})

describe('reconcileValidatorInstances', () => {
  it('normalizes missing and empty definitions to null', () => {
    const owner = { name: 'form' }

    expect(
      reconcileValidatorInstances({
        definitions: undefined,
        instances: null,
        owner,
        scope: 'form',
      }),
    ).toBeNull()
    expect(
      reconcileValidatorInstances({
        definitions: [],
        instances: null,
        owner,
        scope: 'form',
      }),
    ).toBeNull()
  })

  it('preserves retained slots and disposes removed slots', () => {
    const owner = { name: 'field' }
    const firstDefinition = createDefinition('first')
    const secondDefinition = createDefinition('second')
    const initial = reconcileValidatorInstances({
      definitions: [firstDefinition, secondDefinition],
      instances: null,
      owner,
      scope: 'field',
    })
    const firstInstance = initial?.[0]
    const secondInstance = initial?.[1]
    const nextDefinition = createDefinition('next')

    const next = reconcileValidatorInstances({
      definitions: [nextDefinition],
      instances: initial,
      owner,
      scope: 'field',
    })

    expect(next).toBe(initial)
    expect(next).toEqual([firstInstance])
    expect(firstInstance?.definition).toBe(nextDefinition)
    expect(firstInstance?.revision).toBe(1)
    expect(secondInstance?.disposed).toBe(true)
  })

  it('creates added slots and disposes all slots when cleared', () => {
    const owner = { name: 'group' }
    const firstDefinition = createDefinition('first')
    const initial = reconcileValidatorInstances({
      definitions: [firstDefinition],
      instances: null,
      owner,
      scope: 'group',
    })
    const firstInstance = initial?.[0]
    const secondDefinition = createDefinition('second')

    const expanded = reconcileValidatorInstances({
      definitions: [firstDefinition, secondDefinition],
      instances: initial,
      owner,
      scope: 'group',
    })
    const secondInstance = expanded?.[1]

    expect(expanded).toBe(initial)
    expect(firstInstance?.revision).toBe(1)
    expect(secondInstance?.definition).toBe(secondDefinition)
    expect(secondInstance?.owner).toBe(owner)
    expect(secondInstance?.scope).toBe('group')

    expect(
      reconcileValidatorInstances({
        definitions: null,
        instances: expanded,
        owner,
        scope: 'group',
      }),
    ).toBeNull()
    expect(firstInstance?.disposed).toBe(true)
    expect(secondInstance?.disposed).toBe(true)
  })
})
