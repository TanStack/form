import { describe, expect, it } from 'vitest'
import { resolveDefaultOptions } from '../src/defaultOptions.lib'
import type {
  DefaultFormOptions,
  DefaultListenersMergeMode,
} from '../src/defaultOptions.public'

const defaultListener = {
  triggers: ['change'] as Array<'change'>,
  run: () => undefined,
}
const incomingListener = {
  triggers: ['change'] as Array<'change'>,
  run: () => undefined,
}

describe('resolveDefaultOptions', () => {
  it('returns the original options when defaults are omitted', () => {
    const options = { defaultValues: { name: '' } }

    const resolved = resolveDefaultOptions(options)

    expect(resolved).toBe(options)
  })

  it('applies defaults before incoming options and strips merge metadata', () => {
    const defaultErrorVisibility = () => true
    const options = {
      defaultValues: { name: '' },
      errorVisibility: undefined,
    }
    const defaultOptions: DefaultFormOptions = {
      errorVisibility: defaultErrorVisibility,
      onSubmitInvalid: () => undefined,
      listenersMerge: 'append',
    }

    const resolved = resolveDefaultOptions(options, defaultOptions)

    expect(resolved).toMatchObject({
      defaultValues: { name: '' },
      errorVisibility: undefined,
      onSubmitInvalid: defaultOptions.onSubmitInvalid,
    })
    expect(resolved).not.toHaveProperty('listenersMerge')
  })

  it.each<{
    mode: DefaultListenersMergeMode
    expected: Array<typeof defaultListener | typeof incomingListener>
  }>([
    { mode: 'replace', expected: [incomingListener] },
    { mode: 'append', expected: [defaultListener, incomingListener] },
    { mode: 'prepend', expected: [incomingListener, defaultListener] },
  ])('resolves listeners using $mode', ({ mode, expected }) => {
    const defaultListeners = [defaultListener]
    const incomingListeners = [incomingListener]

    const resolved = resolveDefaultOptions(
      { defaultValues: {}, listeners: incomingListeners },
      {
        listeners: defaultListeners,
        listenersMerge: mode,
      },
    )

    expect(resolved.listeners).toEqual(expected)
    expect(defaultListeners).toEqual([defaultListener])
    expect(incomingListeners).toEqual([incomingListener])
  })

  it('uses defaults for omitted properties and respects explicit undefined', () => {
    const defaults = {
      listeners: [defaultListener],
      listenersMerge: 'append' as const,
    }
    const inherited = resolveDefaultOptions({ defaultValues: {} }, defaults)
    const suppressed = resolveDefaultOptions(
      { defaultValues: {}, listeners: undefined },
      defaults,
    )

    expect(
      (inherited as typeof inherited & { listeners: Array<unknown> }).listeners,
    ).toEqual([defaultListener])
    expect(suppressed.listeners).toBeUndefined()
  })
})
