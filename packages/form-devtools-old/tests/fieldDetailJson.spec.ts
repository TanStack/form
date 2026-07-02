import { describe, expect, it } from 'vitest'
import {
  getFieldDetailJsonState,
  stringifyFieldDetailJsonState,
} from '../src/components/FieldDetailCard/fieldDetailJson'
import type { BroadcastFieldDetailState } from '../src/eventClientTypes'

function createFieldDetail(
  fieldDetail: Partial<BroadcastFieldDetailState> & {
    path: string
  },
): BroadcastFieldDetailState {
  const { path, ...fieldDetailOverrides } = fieldDetail

  return {
    id: 'form',
    instanceId: 'instance',
    path,
    status: 'valid',
    state: {
      value: 'Ada',
      meta: {
        isTouched: false,
        isDirty: false,
        isPristine: true,
        isDefaultValue: true,
        isBlurred: false,
        isValidating: false,
        isSelfTouched: false,
        isSelfDirty: false,
        isSelfValidating: false,
        isSelfValid: true,
        isValid: true,
        isInvalid: false,
        subfields: {
          isEveryValid: true,
          isAnyInvalid: false,
          isEveryPristine: true,
          isSomeDirty: false,
          isSomeTouched: false,
          isSomeValidating: false,
        },
        errors: [],
        original: {
          errors: [],
          isValid: true,
          isInvalid: false,
        },
      },
    },
    defaultValue: '',
    isChangedFromDefault: false,
    isArray: false,
    dependencies: {
      watches: [],
      watchedBy: [],
    },
    ...fieldDetailOverrides,
  }
}

describe('field detail JSON state', () => {
  it('includes field name, current value, default value, and meta when raw values are included', () => {
    const fieldDetail = createFieldDetail({
      path: 'profile.name',
      defaultValue: 'Grace',
    })

    expect(getFieldDetailJsonState(fieldDetail, true)).toEqual({
      name: 'profile.name',
      values: {
        current: 'Ada',
        default: 'Grace',
      },
      meta: fieldDetail.state.meta,
    })
  })

  it('uses null values when raw values are hidden', () => {
    const fieldDetail = createFieldDetail({
      path: 'profile.name',
      defaultValue: 'Grace',
    })

    expect(getFieldDetailJsonState(fieldDetail, false)).toEqual({
      name: 'profile.name',
      values: null,
      meta: fieldDetail.state.meta,
    })
  })

  it('does not include watched field dependencies', () => {
    const fieldDetail = createFieldDetail({
      path: 'profile.name',
      dependencies: {
        watches: [{ path: 'profile.email', kind: 'listener', itemIndex: 0 }],
        watchedBy: [{ path: 'summary', kind: 'validator', itemIndex: 1 }],
      },
    })

    expect(getFieldDetailJsonState(fieldDetail, true)).toEqual({
      name: 'profile.name',
      values: {
        current: 'Ada',
        default: '',
      },
      meta: fieldDetail.state.meta,
    })
  })

  it('stringifies unsupported JSON values without dropping the top-level shape', () => {
    const fieldDetail = createFieldDetail({
      path: 'profile.name',
      state: {
        ...createFieldDetail({ path: 'profile.name' }).state,
        value: undefined,
      },
      defaultValue: undefined,
    })

    const parsed = JSON.parse(
      stringifyFieldDetailJsonState(getFieldDetailJsonState(fieldDetail, true)),
    )

    expect(Object.keys(parsed)).toEqual(['name', 'values', 'meta'])
    expect(parsed.values).toEqual({
      current: '[undefined]',
      default: '[undefined]',
    })
  })
})
