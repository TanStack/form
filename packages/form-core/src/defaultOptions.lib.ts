import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultListenersMergeMode,
} from './defaultOptions.public'

type AnyDefaultOptions =
  DefaultFormOptions | DefaultFieldOptions | DefaultFormGroupOptions

interface OptionsWithListeners {
  listeners?: Array<unknown>
}

interface RuntimeDefaultOptions extends OptionsWithListeners {
  listenersMerge?: DefaultListenersMergeMode
  [key: string]: unknown
}

/**
 * Resolves usage-site options against reusable defaults without mutating
 * either input.
 */
export function resolveDefaultOptions<TOptions extends object>(
  options: TOptions,
  defaultOptions?: AnyDefaultOptions,
): TOptions {
  if (!defaultOptions) return options

  const { listenersMerge = 'replace', ...optionDefaults } =
    defaultOptions as RuntimeDefaultOptions
  const resolvedOptions = { ...optionDefaults, ...options } as TOptions

  if (!Object.hasOwn(options, 'listeners') || listenersMerge === 'replace') {
    return resolvedOptions
  }

  const incomingListeners = (options as OptionsWithListeners).listeners
  const defaultListeners = optionDefaults.listeners

  if (incomingListeners === undefined || defaultListeners === undefined) {
    return resolvedOptions
  }

  const resolvedListeners =
    listenersMerge === 'append'
      ? [...defaultListeners, ...incomingListeners]
      : [...incomingListeners, ...defaultListeners]

  return { ...resolvedOptions, listeners: resolvedListeners }
}
