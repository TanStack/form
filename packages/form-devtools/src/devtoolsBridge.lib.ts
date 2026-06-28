import { getBy, uuid } from '@tanstack/form-core/internals'
import { emitFormEvent, onFormEvent } from './eventClient.lib'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
  FieldLifecycleReference,
  FieldListenToFields,
  FieldWatchingFields,
  FormDevtoolsBridge,
  FormDevtoolsCleanupReason,
  InternalFieldMeta,
  InternalFieldState,
} from '@tanstack/form-core/internals'
import type {
  BroadcastFieldDependencies,
  BroadcastFieldDependencyKind,
  BroadcastFieldDependencyLink,
  BroadcastFieldDetailState,
  BroadcastFieldDetailSubscribeRequest,
  BroadcastFieldDetailUnsubscribeRequest,
  BroadcastMountedFieldSummary,
} from './eventClientTypes'

interface DevtoolsFieldDetailSubscription {
  path: string
  field: AnyInternalFieldApi
  includeRawValues: boolean
  includeArrayFields: boolean
  storeSub: { unsubscribe: () => void }
}

const formInstanceIds = new WeakMap<AnyInternalFormApi, string>()
const fieldDetailSubscriptions = new WeakMap<
  AnyInternalFormApi,
  Map<string, DevtoolsFieldDetailSubscription>
>()
const fieldListSubscribedForms = new WeakSet<AnyInternalFormApi>()
const pendingFieldListStateForms = new WeakSet<AnyInternalFormApi>()
const pendingFieldRenames = new WeakMap<
  AnyInternalFormApi,
  Map<AnyInternalFieldApi, FieldLifecycleReference>
>()
const pendingFieldRenameForms = new WeakSet<AnyInternalFormApi>()
const formEventCleanups = new WeakMap<AnyInternalFormApi, () => void>()

function scheduleDevtoolsTask(fn: () => void): void {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn)
    return
  }

  setTimeout(fn, 0)
}

export function getDevtoolsFormInstanceId(form: AnyInternalFormApi): string {
  const existing = formInstanceIds.get(form)
  if (existing) return existing

  const instanceId = uuid()
  formInstanceIds.set(form, instanceId)
  return instanceId
}

function getFieldDetailSubscriptions(
  form: AnyInternalFormApi,
): Map<string, DevtoolsFieldDetailSubscription> {
  let subscriptions = fieldDetailSubscriptions.get(form)

  if (!subscriptions) {
    subscriptions = new Map()
    fieldDetailSubscriptions.set(form, subscriptions)
  }

  return subscriptions
}

function emitDevtoolsFieldListStateNow(form: AnyInternalFormApi): void {
  if (!fieldListSubscribedForms.has(form)) return

  emitFormEvent('field-list-state', {
    id: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
    fields: getDevtoolsMountedFieldSummaries(form),
  })
}

function emitDevtoolsFieldListState(
  form: AnyInternalFormApi,
  options: { sync?: boolean } = {},
): void {
  if (!fieldListSubscribedForms.has(form)) return

  if (options.sync) {
    pendingFieldListStateForms.delete(form)
    emitDevtoolsFieldListStateNow(form)
    return
  }

  if (pendingFieldListStateForms.has(form)) return

  pendingFieldListStateForms.add(form)
  scheduleDevtoolsTask(() => {
    pendingFieldListStateForms.delete(form)
    emitDevtoolsFieldListStateNow(form)
  })
}

function getArraySummary(value: any): {
  isArray: boolean
  arrayLength?: number
} {
  if (!Array.isArray(value)) {
    return { isArray: false }
  }

  return {
    isArray: true,
    arrayLength: value.length,
  }
}

function getDevtoolsFieldStatus(
  meta: InternalFieldMeta,
): BroadcastFieldDetailState['status'] {
  if (meta.isValidating) return 'validating'
  if (meta.isValid) return 'valid'
  return 'invalid'
}

function getDevtoolsFieldStateSnapshot(
  state: InternalFieldState,
  includeRawValues: boolean,
): BroadcastFieldDetailState['state'] {
  const meta = state.meta
  const snapshot: BroadcastFieldDetailState['state'] = {
    meta: {
      isTouched: meta.isTouched,
      isDirty: meta.isDirty,
      isPristine: meta.isPristine,
      isDefaultValue: meta.isDefaultValue,
      isBlurred: meta.isBlurred,
      isValidating: meta.isValidating,
      isSelfTouched: meta.isSelfTouched,
      isSelfDirty: meta.isSelfDirty,
      isSelfValidating: meta.isSelfValidating,
      isSelfValid: meta.isSelfValid,
      isValid: meta.isValid,
      isInvalid: meta.isInvalid,
      subfields: { ...meta.subfields },
      errors: meta.errors,
      original: {
        errors: meta.original.errors,
        isValid: meta.original.isValid,
        isInvalid: meta.original.isInvalid,
      },
    },
  }

  if (includeRawValues) {
    snapshot.value = state.value
  }

  return snapshot
}

function createFieldDependencyLink({
  path,
  configuredPath,
  configuredPathBase,
  itemIndex,
  kind,
}: {
  path: string
  kind: BroadcastFieldDependencyKind
  itemIndex: number
  configuredPath?: string
  configuredPathBase?: string
}): BroadcastFieldDependencyLink {
  const comparisonPath = configuredPathBase ?? path

  return configuredPath && configuredPath !== comparisonPath
    ? { path, kind, itemIndex, configuredPath }
    : { path, kind, itemIndex }
}

function compareFieldDependencyLinks(
  left: BroadcastFieldDependencyLink,
  right: BroadcastFieldDependencyLink,
): number {
  const pathOrder = left.path.localeCompare(right.path)
  if (pathOrder !== 0) return pathOrder

  const kindOrder =
    left.kind === right.kind ? 0 : left.kind === 'listener' ? -1 : 1
  if (kindOrder !== 0) return kindOrder

  return left.itemIndex - right.itemIndex
}

function getWatchedFieldDependencies(
  listenToFields: FieldListenToFields | null,
  kind: BroadcastFieldDependencyKind,
): Array<BroadcastFieldDependencyLink> {
  const dependencies: Array<BroadcastFieldDependencyLink> = []

  listenToFields?.forEach((sourceMetas, itemIndex) => {
    for (const sourceMeta of sourceMetas) {
      const sourceField = sourceMeta.field
      if (sourceField._isKilled) continue

      dependencies.push(
        createFieldDependencyLink({
          path: sourceField.name,
          kind,
          itemIndex,
          configuredPath: sourceMeta.name,
        }),
      )
    }
  })

  return dependencies
}

function getConfiguredWatchedPath(
  sourceField: AnyInternalFieldApi,
  listenToFields: FieldListenToFields | null,
  itemIndex: number,
): string | undefined {
  return listenToFields?.[itemIndex]?.find(
    (sourceMeta) => sourceMeta.field === sourceField,
  )?.name
}

function getWatchingFieldDependencies({
  getListenToFields,
  kind,
  sourceField,
  watchingFields,
}: {
  sourceField: AnyInternalFieldApi
  watchingFields: FieldWatchingFields | null
  getListenToFields: (
    watchingField: AnyInternalFieldApi,
  ) => FieldListenToFields | null
  kind: BroadcastFieldDependencyKind
}): Array<BroadcastFieldDependencyLink> {
  const dependencies: Array<BroadcastFieldDependencyLink> = []

  watchingFields?.forEach((itemIndexes, watchingField) => {
    if (watchingField._isKilled) return

    const listenToFields = getListenToFields(watchingField)
    const sortedItemIndexes = Array.from(itemIndexes).sort((left, right) => {
      return left - right
    })

    for (const itemIndex of sortedItemIndexes) {
      dependencies.push(
        createFieldDependencyLink({
          path: watchingField.name,
          kind,
          itemIndex,
          configuredPath: getConfiguredWatchedPath(
            sourceField,
            listenToFields,
            itemIndex,
          ),
          configuredPathBase: sourceField.name,
        }),
      )
    }
  })

  return dependencies
}

function getDevtoolsFieldDependencies(
  field: AnyInternalFieldApi,
): BroadcastFieldDependencies {
  return {
    watches: [
      ...getWatchedFieldDependencies(field._listenToFields, 'listener'),
      ...getWatchedFieldDependencies(field._validateOnFields, 'validator'),
    ].sort(compareFieldDependencyLinks),
    watchedBy: [
      ...getWatchingFieldDependencies({
        sourceField: field,
        watchingFields: field._watchingFields,
        getListenToFields: (watchingField) => watchingField._listenToFields,
        kind: 'listener',
      }),
      ...getWatchingFieldDependencies({
        sourceField: field,
        watchingFields: field._watchingValidatorFields,
        getListenToFields: (watchingField) => watchingField._validateOnFields,
        kind: 'validator',
      }),
    ].sort(compareFieldDependencyLinks),
  }
}

export function getDevtoolsFieldDetailSnapshot(
  field: AnyInternalFieldApi,
  options: {
    includeRawValues?: boolean
  } = {},
): BroadcastFieldDetailState {
  const state = field.state
  const value = state.value
  const defaultValue = getBy(field.form.options.defaultValues, field.name)
  const meta = state.meta
  const arraySummary = getArraySummary(value)
  const includeRawValues = options.includeRawValues === true
  const result: BroadcastFieldDetailState = {
    id: field.form.formId,
    instanceId: getDevtoolsFormInstanceId(field.form),
    path: field.name,
    status: getDevtoolsFieldStatus(meta),
    state: getDevtoolsFieldStateSnapshot(state, includeRawValues),
    ...(includeRawValues ? { defaultValue } : {}),
    isChangedFromDefault: !meta.isDefaultValue,
    ...arraySummary,
    dependencies: getDevtoolsFieldDependencies(field),
  }

  return result
}

function getDevtoolsMountedFieldSummary(
  field: AnyInternalFieldApi,
): BroadcastMountedFieldSummary {
  const value = field._getValue()
  const meta = field.state.meta
  const arraySummary = getArraySummary(value)
  const visibleErrorCount = meta.errors.length
  const hiddenErrorCount = Math.max(
    0,
    meta.original.errors.length - visibleErrorCount,
  )

  return {
    id: field.form.formId,
    instanceId: getDevtoolsFormInstanceId(field.form),
    path: field.name,
    isTouched: meta.isTouched,
    isDirty: meta.isDirty,
    isDefaultValue: meta.isDefaultValue,
    isBlurred: meta.isBlurred,
    isValid: meta.isValid,
    errorCount: visibleErrorCount,
    visibleErrorCount,
    hiddenErrorCount,
    ...arraySummary,
  }
}

function getDevtoolsMountedFieldSummaries(
  form: AnyInternalFormApi,
): Array<BroadcastMountedFieldSummary> {
  const summaries: Array<BroadcastMountedFieldSummary> = []
  const stack = [...form._fieldRootNode._children]

  while (stack.length > 0) {
    const field = stack.shift()!

    if (field._isMounted) {
      summaries.push(getDevtoolsMountedFieldSummary(field))
    }

    stack.push(...field._children)
  }

  return summaries
}

function handleDevtoolsFieldMounted(field: AnyInternalFieldApi): void {
  emitDevtoolsFieldListState(field.form)
}

function handleDevtoolsFieldUnmounted(
  field: AnyInternalFieldApi,
  path = field.name,
): void {
  unsubscribeDevtoolsFieldDetail(field.form, path)
  emitDevtoolsFieldListState(field.form)
}

function handleDevtoolsFieldSubtreeUnmounted(
  form: AnyInternalFormApi,
  fields: ReadonlyArray<FieldLifecycleReference>,
): void {
  if (fields.length === 0) return

  for (const { previousPath } of fields) {
    unsubscribeDevtoolsFieldDetail(form, previousPath)
  }

  emitDevtoolsFieldListState(form)
}

function handleDevtoolsFieldSummaryChange(field: AnyInternalFieldApi): void {
  if (!field._isMounted) return

  emitDevtoolsFieldListState(field.form)
}

function handleDevtoolsFieldDetailChange(field: AnyInternalFieldApi): void {
  const subscription = fieldDetailSubscriptions.get(field.form)?.get(field.name)
  if (!subscription) return

  emitDevtoolsFieldDetailState(field.form, subscription)
}

function handleDevtoolsFieldStateChange(
  field: AnyInternalFieldApi,
  scope: { summary?: boolean; detail?: boolean },
): void {
  if (scope.summary) {
    handleDevtoolsFieldSummaryChange(field)
  }

  if (scope.detail) {
    handleDevtoolsFieldDetailChange(field)
  }
}

function handleDevtoolsFieldPathChanges(
  form: AnyInternalFormApi,
  renames: ReadonlyArray<FieldLifecycleReference>,
): void {
  if (renames.length === 0) return

  let didRenameMountedField = false
  const detailRenames: Array<{
    previousPath: string
    field: AnyInternalFieldApi
    includeRawValues: boolean
    includeArrayFields: boolean
  }> = []
  const subscriptions = getFieldDetailSubscriptions(form)

  for (const rename of renames) {
    const detailSubscription = subscriptions.get(rename.previousPath)

    if (detailSubscription) {
      detailRenames.push({
        previousPath: rename.previousPath,
        field: rename.field,
        includeRawValues: detailSubscription.includeRawValues,
        includeArrayFields: detailSubscription.includeArrayFields,
      })
    }

    if (rename.field._isMounted) {
      didRenameMountedField = true
    }
  }

  for (const rename of detailRenames) {
    unsubscribeDevtoolsFieldDetail(form, rename.previousPath)
  }

  for (const rename of detailRenames) {
    subscribeDevtoolsFieldDetail(form, {
      id: form.formId,
      instanceId: getDevtoolsFormInstanceId(form),
      path: rename.field.name,
      includeRawValues: rename.includeRawValues,
      includeArrayFields: rename.includeArrayFields,
    })
  }

  if (didRenameMountedField) {
    emitDevtoolsFieldListState(form)
  }
}

function queueDevtoolsFieldPathChanges(
  form: AnyInternalFormApi,
  renames: ReadonlyArray<FieldLifecycleReference>,
): void {
  if (renames.length === 0) return

  let pending = pendingFieldRenames.get(form)
  if (!pending) {
    pending = new Map()
    pendingFieldRenames.set(form, pending)
  }

  for (const rename of renames) {
    if (!pending.has(rename.field)) {
      pending.set(rename.field, rename)
    }
  }

  if (pendingFieldRenameForms.has(form)) return

  pendingFieldRenameForms.add(form)
  scheduleDevtoolsTask(() => {
    pendingFieldRenameForms.delete(form)

    const queuedRenames = pendingFieldRenames.get(form)
    if (!queuedRenames) return

    pendingFieldRenames.delete(form)
    handleDevtoolsFieldPathChanges(form, Array.from(queuedRenames.values()))
  })
}

function emitDevtoolsFormRegistered(form: AnyInternalFormApi): void {
  emitFormEvent('form-registered', {
    id: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
  })
}

function emitDevtoolsFormUnregistered(form: AnyInternalFormApi): void {
  emitFormEvent('form-unregistered', {
    id: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
  })
}

function isDevtoolsFormRequestForForm(
  form: AnyInternalFormApi,
  payload: { id: string; instanceId: string },
): boolean {
  return (
    payload.id === form.formId &&
    payload.instanceId === getDevtoolsFormInstanceId(form)
  )
}

function isDevtoolsFieldDetailRequestForForm(
  form: AnyInternalFormApi,
  payload:
    | BroadcastFieldDetailSubscribeRequest
    | BroadcastFieldDetailUnsubscribeRequest,
): boolean {
  return isDevtoolsFormRequestForForm(form, payload)
}

function emitDevtoolsFieldDetailState(
  form: AnyInternalFormApi,
  subscription: DevtoolsFieldDetailSubscription,
): void {
  const { field } = subscription

  if (field._isKilled || !field._isMounted) {
    unsubscribeDevtoolsFieldDetail(form, subscription.path)
    return
  }

  if (!subscription.includeArrayFields && Array.isArray(field._getValue())) {
    unsubscribeDevtoolsFieldDetail(form, subscription.path)
    return
  }

  emitFormEvent(
    'field-detail-state',
    getDevtoolsFieldDetailSnapshot(field, {
      includeRawValues: subscription.includeRawValues,
    }),
  )
}

export function subscribeDevtoolsFieldDetail(
  form: AnyInternalFormApi,
  payload: BroadcastFieldDetailSubscribeRequest,
): void {
  if (!isDevtoolsFieldDetailRequestForForm(form, payload)) {
    return
  }

  const field = form._tryGetFieldApi(payload.path)
  if (!field || !field._isMounted) return

  const includeRawValues = payload.includeRawValues === true
  const includeArrayFields = payload.includeArrayFields === true

  if (!includeArrayFields && Array.isArray(field._getValue())) return

  const subscriptions = getFieldDetailSubscriptions(form)
  const existing = subscriptions.get(payload.path)
  if (
    existing &&
    existing.field === field &&
    existing.includeRawValues === includeRawValues &&
    existing.includeArrayFields === includeArrayFields
  ) {
    emitDevtoolsFieldDetailState(form, existing)
    return
  }

  unsubscribeDevtoolsFieldDetail(form, payload.path)

  const subscription: DevtoolsFieldDetailSubscription = {
    path: payload.path,
    field,
    includeRawValues,
    includeArrayFields,
    storeSub: { unsubscribe: () => {} },
  }
  subscription.storeSub = field.atom.subscribe(() => {
    emitDevtoolsFieldDetailState(form, subscription)
  })
  subscriptions.set(payload.path, subscription)
  emitDevtoolsFieldDetailState(form, subscription)
}

export function unsubscribeDevtoolsFieldDetail(
  form: AnyInternalFormApi,
  path: string,
): void {
  const subscription = fieldDetailSubscriptions.get(form)?.get(path)
  if (!subscription) return

  subscription.storeSub.unsubscribe()
  fieldDetailSubscriptions.get(form)?.delete(path)
}

function unsubscribeAllDevtoolsFieldDetails(form: AnyInternalFormApi): void {
  const subscriptions = fieldDetailSubscriptions.get(form)
  if (!subscriptions) return

  for (const path of Array.from(subscriptions.keys())) {
    unsubscribeDevtoolsFieldDetail(form, path)
  }

  fieldDetailSubscriptions.delete(form)
}

function registerDevtoolsFormEventListeners(
  form: AnyInternalFormApi,
): () => void {
  const unsubSnapshot = onFormEvent('subscribe-form-registry', () => {
    emitDevtoolsFormRegistered(form)
  })
  const unsubFieldListSubscribe = onFormEvent(
    'subscribe-field-list',
    (event) => {
      if (isDevtoolsFormRequestForForm(form, event.payload)) {
        fieldListSubscribedForms.add(form)
        emitDevtoolsFieldListState(form, { sync: true })
      }
    },
  )
  const unsubFieldListUnsubscribe = onFormEvent(
    'unsubscribe-field-list',
    (event) => {
      if (isDevtoolsFormRequestForForm(form, event.payload)) {
        fieldListSubscribedForms.delete(form)
      }
    },
  )
  const unsubFieldDetailSubscribe = onFormEvent(
    'subscribe-field-detail',
    (event) => {
      subscribeDevtoolsFieldDetail(form, event.payload)
    },
  )
  const unsubFieldDetailUnsubscribe = onFormEvent(
    'unsubscribe-field-detail',
    (event) => {
      if (isDevtoolsFieldDetailRequestForForm(form, event.payload)) {
        unsubscribeDevtoolsFieldDetail(form, event.payload.path)
      }
    },
  )

  return () => {
    unsubSnapshot()
    unsubFieldListSubscribe()
    unsubFieldListUnsubscribe()
    unsubFieldDetailSubscribe()
    unsubFieldDetailUnsubscribe()
  }
}

function cleanupDevtoolsForm(
  form: AnyInternalFormApi,
  reason: FormDevtoolsCleanupReason,
): void {
  formEventCleanups.get(form)?.()
  formEventCleanups.delete(form)
  unsubscribeAllDevtoolsFieldDetails(form)
  fieldListSubscribedForms.delete(form)
  pendingFieldListStateForms.delete(form)
  pendingFieldRenameForms.delete(form)
  pendingFieldRenames.delete(form)

  if (reason === 'form-unmounted') {
    emitDevtoolsFormUnregistered(form)
    formInstanceIds.delete(form)
  }
}

function mountDevtoolsForm(form: AnyInternalFormApi) {
  const cleanup = registerDevtoolsFormEventListeners(form)
  formEventCleanups.set(form, cleanup)
  emitDevtoolsFormRegistered(form)

  return (reason: FormDevtoolsCleanupReason) => {
    cleanupDevtoolsForm(form, reason)
  }
}

export function createFormDevtoolsBridge(): FormDevtoolsBridge {
  return {
    mountForm: mountDevtoolsForm,
    fieldMounted: handleDevtoolsFieldMounted,
    fieldUnmounted: handleDevtoolsFieldUnmounted,
    fieldSubtreeUnmounted: handleDevtoolsFieldSubtreeUnmounted,
    fieldPathsChanged: queueDevtoolsFieldPathChanges,
    fieldStateChanged: handleDevtoolsFieldStateChange,
  }
}
