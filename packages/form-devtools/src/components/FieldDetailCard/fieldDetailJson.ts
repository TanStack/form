import type {
  FieldDetailMetaSnapshot,
  FieldDetailSnapshot,
} from './fieldDetailTypes'

interface FieldDetailJsonValues {
  current: unknown
  default: unknown
}

export interface FieldDetailJsonState {
  name: string
  values: FieldDetailJsonValues | null
  meta: FieldDetailMetaSnapshot
}

export function getFieldDetailJsonState(
  field: FieldDetailSnapshot,
  includeRawValues: boolean,
): FieldDetailJsonState {
  return {
    name: field.path,
    values: includeRawValues
      ? {
          current: field.state.value,
          default: field.defaultValue,
        }
      : null,
    meta: field.state.meta,
  }
}

function createFieldDetailJsonReplacer() {
  const seenObjects = new WeakSet<object>()

  return (_key: string, value: unknown): unknown => {
    if (value === undefined) return '[undefined]'
    if (typeof value === 'bigint') return `${value.toString()}n`
    if (typeof value === 'function') {
      return value.name ? `[Function: ${value.name}]` : '[Function]'
    }
    if (typeof value === 'symbol') return value.toString()

    if (value !== null && typeof value === 'object') {
      if (seenObjects.has(value)) return '[Circular]'
      seenObjects.add(value)
    }

    return value
  }
}

export function stringifyFieldDetailJsonState(
  state: FieldDetailJsonState,
): string {
  return JSON.stringify(state, createFieldDetailJsonReplacer(), 2)
}
