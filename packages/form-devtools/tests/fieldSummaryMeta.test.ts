import { defaultFieldMeta } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import {
  createBaselinePatch,
  defaultDevtoolsMountedFieldSummary,
  diffBaselinePatches,
  hydrateDevtoolsMountedFieldSummary,
  toDevtoolsMountedFieldSummaryPatch,
} from '../src/fieldSummaryMeta'

describe('field summary meta', () => {
  it('creates a generic sparse patch against a baseline', () => {
    expect(
      createBaselinePatch(
        { isDirty: true, errorCount: 0, status: 'invalid' },
        { isDirty: false, errorCount: 0, status: 'valid' },
      ),
    ).toEqual({ isDirty: true, status: 'invalid' })
  })

  it('omits default field meta and includes non-default field meta', () => {
    expect(toDevtoolsMountedFieldSummaryPatch(defaultFieldMeta)).toBeUndefined()
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        isDirty: true,
        isPristine: false,
      }),
    ).toEqual({ isDirty: true })
  })

  it('hydrates sparse patches against the Devtools baseline', () => {
    expect(hydrateDevtoolsMountedFieldSummary()).toBe(
      defaultDevtoolsMountedFieldSummary,
    )
    expect(hydrateDevtoolsMountedFieldSummary({})).toBe(
      defaultDevtoolsMountedFieldSummary,
    )
    expect(hydrateDevtoolsMountedFieldSummary({ isDirty: true })).toEqual({
      isDirty: true,
    })
  })

  it('diffs sparse patches into set and clear operations', () => {
    expect(
      diffBaselinePatches<{
        isDirty: boolean
        status: string
        errorCount: number
      }>(
        { isDirty: false, status: 'invalid' },
        { isDirty: true, errorCount: 2 },
      ),
    ).toEqual({
      set: { isDirty: true, errorCount: 2 },
      clear: ['status'],
    })

    expect(diffBaselinePatches({ isDirty: true }, { isDirty: true })).toEqual({
      set: undefined,
      clear: undefined,
    })
  })
})
