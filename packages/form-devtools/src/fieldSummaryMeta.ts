import { defaultFieldMeta } from '@tanstack/form-core/internals'
import type { InternalFieldMeta } from '@tanstack/form-core/internals'
import type {
  DevtoolsMountedFieldSummary,
  DevtoolsMountedFieldSummaryPatch,
  DevtoolsMountedFieldValidity,
} from './eventClientTypes'

export const defaultDevtoolsMountedFieldSummary = Object.freeze({
  isDirty: defaultFieldMeta.isDirty,
  isTouched: defaultFieldMeta.isTouched,
  validity: toDevtoolsMountedFieldValidity(defaultFieldMeta),
}) satisfies DevtoolsMountedFieldSummary

export function toDevtoolsMountedFieldSummary(
  meta: InternalFieldMeta,
): DevtoolsMountedFieldSummary {
  return {
    isDirty: meta.isDirty,
    isTouched: meta.isTouched,
    validity: toDevtoolsMountedFieldValidity(meta),
  }
}

function toDevtoolsMountedFieldValidity(
  meta: InternalFieldMeta,
): DevtoolsMountedFieldValidity {
  // The public projection can be valid while original meta retains hidden errors.
  if (!meta.isValid) return 'invalid'
  if (!meta.original.isValid) return 'invalidHidden'
  return 'valid'
}

export function createBaselinePatch<T extends object>(
  value: T,
  baseline: T,
): Partial<T> | undefined {
  let patch: Partial<T> | undefined

  for (const key of Object.keys(value) as Array<keyof T>) {
    if (!Object.is(value[key], baseline[key])) {
      const allocatedPatch = patch ?? (patch = {} as Partial<T>)
      allocatedPatch[key] = value[key]
    }
  }

  return patch
}

export function toDevtoolsMountedFieldSummaryPatch(
  meta: InternalFieldMeta,
): DevtoolsMountedFieldSummaryPatch | undefined {
  return createBaselinePatch(
    toDevtoolsMountedFieldSummary(meta),
    defaultDevtoolsMountedFieldSummary,
  )
}

export function hydrateDevtoolsMountedFieldSummary(
  patch?: DevtoolsMountedFieldSummaryPatch,
): DevtoolsMountedFieldSummary {
  if (!patch || Object.keys(patch).length === 0) {
    return defaultDevtoolsMountedFieldSummary
  }

  return {
    ...defaultDevtoolsMountedFieldSummary,
    ...patch,
  }
}

export interface BaselinePatchDifference<T extends object> {
  set?: Partial<T>
  clear?: Array<keyof T>
}

export function diffBaselinePatches<T extends object>(
  previous: Partial<T> | undefined,
  next: Partial<T> | undefined,
): BaselinePatchDifference<T> {
  let set: Partial<T> | undefined
  let clear: Array<keyof T> | undefined
  const keys = new Set<keyof T>([
    ...(Object.keys(previous ?? {}) as Array<keyof T>),
    ...(Object.keys(next ?? {}) as Array<keyof T>),
  ])

  for (const key of keys) {
    const hadPrevious = Object.hasOwn(previous ?? {}, key)
    const hasNext = Object.hasOwn(next ?? {}, key)

    if (!hasNext) {
      if (hadPrevious) (clear ??= []).push(key)
      continue
    }

    if (!hadPrevious || !Object.is(previous?.[key], next?.[key])) {
      const allocatedSet = set ?? (set = {} as Partial<T>)
      allocatedSet[key] = next![key]
    }
  }

  return { set, clear }
}
