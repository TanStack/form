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
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        isTouched: true,
      }),
    ).toEqual({ isTouched: true })
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        isBlurred: true,
      }),
    ).toEqual({ isBlurred: true })
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        isDefaultValue: false,
      }),
    ).toEqual({ isDefaultValue: false })
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        isValid: false,
        isInvalid: true,
      }),
    ).toEqual({ validity: 'invalid' })
    expect(
      toDevtoolsMountedFieldSummaryPatch({
        ...defaultFieldMeta,
        original: {
          ...defaultFieldMeta.original,
          isValid: false,
          isInvalid: true,
        },
      }),
    ).toEqual({ validity: 'invalidHidden' })
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
      isTouched: false,
      isBlurred: false,
      isDefaultValue: true,
      validity: 'valid',
    })
    expect(hydrateDevtoolsMountedFieldSummary({ isTouched: true })).toEqual({
      isDirty: false,
      isTouched: true,
      isBlurred: false,
      isDefaultValue: true,
      validity: 'valid',
    })
    expect(
      hydrateDevtoolsMountedFieldSummary({ validity: 'invalidHidden' }),
    ).toEqual({
      isDirty: false,
      isTouched: false,
      isBlurred: false,
      isDefaultValue: true,
      validity: 'invalidHidden',
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
