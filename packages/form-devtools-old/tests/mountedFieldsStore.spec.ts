import { describe, expect, it } from 'vitest'
import {
  compareMountedFieldPaths,
  removeMountedField,
  renameMountedFields,
  upsertMountedField,
} from '../src/stores/mountedFieldsStore'
import {
  removeFieldDetail,
  removeFieldDetails,
  upsertFieldDetail,
} from '../src/stores/fieldDetailsStore'
import {
  getFieldDetailInterestFields,
  getFieldDetailSubscriptionDescriptors,
  reconcileFieldDetailSubscriptions,
} from '../src/stores/fieldDetailSubscriptions'
import { getVisibleFieldDetailItems } from '../src/components/fieldDetailItems'
import { getMountedFieldMetaBadgeVariants } from '../src/components/MountedFieldsList'
import {
  createFieldSelectionIdentity,
  resolveFieldSelectionIdentities,
  resolveFieldSelectionIdentity,
} from '../src/components/fieldSelectionIdentity'
import type {
  BroadcastFieldDetailState,
  BroadcastMountedFieldSummary,
} from '../src/eventClientTypes'
import type { DevtoolsMountedFieldSummary } from '../src/stores/eventClientTypes'

function createField(
  field: Partial<BroadcastMountedFieldSummary> & {
    path: string
  },
): BroadcastMountedFieldSummary {
  const errorCount = field.errorCount ?? 0

  return {
    id: 'form',
    instanceId: 'instance',
    isTouched: false,
    isDirty: false,
    isDefaultValue: true,
    isBlurred: false,
    isValid: true,
    errorCount,
    visibleErrorCount: field.visibleErrorCount ?? errorCount,
    hiddenErrorCount: 0,
    isArray: false,
    ...field,
  }
}

function createMountedField(
  field: Partial<BroadcastMountedFieldSummary> & {
    path: string
    fieldId: string
  },
): DevtoolsMountedFieldSummary {
  const { fieldId, ...summary } = field
  return {
    ...createField(summary),
    fieldId,
  }
}

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
      value: '',
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

describe('mounted field store helpers', () => {
  it('hydrates, updates, renames, and removes mounted fields with devtools-owned ids', () => {
    let fieldIdIndex = 0
    const createFieldId = () => `field-${++fieldIdIndex}`
    const nameField = createField({
      path: 'items[0].name',
    })
    const emailField = createField({
      path: 'items[0].email',
    })

    let fields = upsertMountedField([], nameField, createFieldId)

    fields = upsertMountedField(fields, emailField, createFieldId)
    expect(fields).toEqual([
      { ...emailField, fieldId: 'field-2' },
      { ...nameField, fieldId: 'field-1' },
    ])

    const invalidNameField = createField({
      path: 'items[0].name',
      isValid: false,
      errorCount: 1,
    })
    fields = upsertMountedField(fields, invalidNameField, createFieldId)
    expect(fields).toEqual([
      { ...emailField, fieldId: 'field-2' },
      { ...invalidNameField, fieldId: 'field-1' },
    ])

    const renamedNameField = createField({
      path: 'items[1].name',
      isValid: false,
      errorCount: 1,
    })
    const renamedEmailField = createField({
      path: 'items[1].email',
    })
    fields = renameMountedFields(
      fields,
      [
        { previousPath: 'items[0].name', field: renamedNameField },
        { previousPath: 'items[0].email', field: renamedEmailField },
      ],
      createFieldId,
    )
    expect(fields).toEqual([
      { ...renamedEmailField, fieldId: 'field-2' },
      { ...renamedNameField, fieldId: 'field-1' },
    ])

    fields = removeMountedField(fields, 'items[1].email')
    expect(fields).toEqual([{ ...renamedNameField, fieldId: 'field-1' }])
  })

  it('sorts mounted fields by parsed path instead of event order', () => {
    let fieldIdIndex = 0
    const createFieldId = () => `field-${++fieldIdIndex}`
    const tenthField = createField({ path: 'items[10].name' })
    const parentField = createField({ path: 'items' })
    const secondField = createField({ path: 'items[2].name' })
    const nestedField = createField({ path: 'items[2].details.email' })

    let fields = upsertMountedField([], tenthField, createFieldId)
    fields = upsertMountedField(fields, nestedField, createFieldId)
    fields = upsertMountedField(fields, parentField, createFieldId)
    fields = upsertMountedField(fields, secondField, createFieldId)

    expect(fields.map((field) => field.path)).toEqual([
      'items',
      'items[2].details.email',
      'items[2].name',
      'items[10].name',
    ])
  })

  it('compares parsed array indices numerically', () => {
    expect(
      compareMountedFieldPaths('items[2].name', 'items[10].name'),
    ).toBeLessThan(0)
  })

  it('shows the mounted field default-value badge only after a dirty field returns to its default value', () => {
    expect(
      getMountedFieldMetaBadgeVariants(
        createMountedField({
          path: 'pristine',
          fieldId: 'field-1',
          isDirty: false,
          isDefaultValue: true,
        }),
      ),
    ).not.toContain('isDefaultValue')

    expect(
      getMountedFieldMetaBadgeVariants(
        createMountedField({
          path: 'reset',
          fieldId: 'field-3',
          isDirty: true,
          isDefaultValue: true,
        }),
      ),
    ).toContain('isDefaultValue')
  })

  it('upserts and removes field detail snapshots by path', () => {
    const nameDetail = createFieldDetail({ path: 'name' })
    const emailDetail = createFieldDetail({ path: 'email' })
    const invalidNameDetail = createFieldDetail({
      path: 'name',
      status: 'invalid',
      isChangedFromDefault: true,
    })

    let fieldDetails = upsertFieldDetail([], nameDetail)
    fieldDetails = upsertFieldDetail(fieldDetails, emailDetail)
    expect(fieldDetails.map((fieldDetail) => fieldDetail.path)).toEqual([
      'email',
      'name',
    ])

    fieldDetails = upsertFieldDetail(fieldDetails, invalidNameDetail)
    expect(
      fieldDetails.find((fieldDetail) => fieldDetail.path === 'name'),
    ).toBe(invalidNameDetail)

    fieldDetails = removeFieldDetail(fieldDetails, 'email')
    expect(fieldDetails).toEqual([invalidNameDetail])

    fieldDetails = removeFieldDetails(fieldDetails, ['name'])
    expect(fieldDetails).toEqual([])
  })

  it('computes selected and pinned field detail interest without duplicates', () => {
    const fields = [
      createMountedField({ path: 'name', fieldId: 'field-1' }),
      createMountedField({ path: 'email', fieldId: 'field-2' }),
      createMountedField({ path: 'age', fieldId: 'field-3' }),
    ]

    const interestFields = getFieldDetailInterestFields(fields, 'name', [
      'name',
      'email',
    ])

    expect(interestFields.map((field) => field.path)).toEqual(['name', 'email'])
  })

  it('resolves selected and pinned fields across field id churn', () => {
    const fields = [
      createMountedField({ path: 'name', fieldId: 'field-1' }),
      createMountedField({ path: 'email', fieldId: 'field-2' }),
    ]
    const nextFields = [
      createMountedField({ path: 'name', fieldId: 'field-3' }),
      createMountedField({ path: 'email', fieldId: 'field-4' }),
    ]

    expect(
      resolveFieldSelectionIdentity(
        nextFields,
        createFieldSelectionIdentity(fields[0]!),
      ),
    ).toEqual(createFieldSelectionIdentity(nextFields[0]!))
    expect(
      resolveFieldSelectionIdentities(nextFields, [
        createFieldSelectionIdentity(fields[0]!),
        createFieldSelectionIdentity(fields[1]!),
      ]),
    ).toEqual([
      createFieldSelectionIdentity(nextFields[0]!),
      createFieldSelectionIdentity(nextFields[1]!),
    ])
  })

  it('creates field detail subscriptions with raw value defaults', () => {
    const fields = [
      createMountedField({ path: 'name', fieldId: 'field-1' }),
      createMountedField({
        path: 'items',
        fieldId: 'field-2',
        isArray: true,
        arrayLength: 2,
      }),
    ]
    const form = { id: 'form', instanceId: 'instance' }
    const includeRawValues = (field: DevtoolsMountedFieldSummary) =>
      !field.isArray

    expect(
      getFieldDetailSubscriptionDescriptors(
        form,
        fields,
        false,
        includeRawValues,
      ),
    ).toEqual([
      {
        id: 'form',
        instanceId: 'instance',
        path: 'name',
        includeRawValues: true,
      },
    ])

    expect(
      getFieldDetailSubscriptionDescriptors(
        form,
        fields,
        true,
        includeRawValues,
      ),
    ).toEqual([
      {
        id: 'form',
        instanceId: 'instance',
        path: 'name',
        includeRawValues: true,
      },
      {
        id: 'form',
        instanceId: 'instance',
        path: 'items',
        includeRawValues: false,
      },
    ])
  })

  it('emits field detail subscription deltas', () => {
    const subscribed: Array<string> = []
    const unsubscribed: Array<string> = []
    const previous = [
      {
        id: 'form',
        instanceId: 'instance',
        path: 'name',
        includeRawValues: true,
      },
    ]
    const next = [
      {
        id: 'form',
        instanceId: 'instance',
        path: 'email',
        includeRawValues: true,
      },
    ]

    const result = reconcileFieldDetailSubscriptions(previous, next, {
      subscribe: (descriptor) => subscribed.push(descriptor.path),
      unsubscribe: (descriptor) => unsubscribed.push(descriptor.path),
    })

    expect(unsubscribed).toEqual(['name'])
    expect(subscribed).toEqual(['email'])
    expect(result).toEqual(next)
  })

  it('filters array detail items when array detail subscriptions are disabled', () => {
    const fields = [
      createMountedField({ path: 'name', fieldId: 'field-1' }),
      createMountedField({
        path: 'items',
        fieldId: 'field-2',
        isArray: true,
        arrayLength: 2,
      }),
    ]
    const nameDetail = createFieldDetail({ path: 'name' })

    const visibleItems = getVisibleFieldDetailItems(fields, [nameDetail], false)

    expect(visibleItems).toEqual([nameDetail])
  })
})
