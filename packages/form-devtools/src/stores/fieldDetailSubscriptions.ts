import type {
  DevtoolsFormState,
  DevtoolsMountedFieldSummary,
} from './eventClientTypes'

export interface FieldDetailSubscriptionDescriptor {
  id: string
  instanceId: string
  path: string
  includeRawValues: boolean
}

interface ReconcileFieldDetailSubscriptionCallbacks {
  subscribe: (descriptor: FieldDetailSubscriptionDescriptor) => void
  unsubscribe: (descriptor: FieldDetailSubscriptionDescriptor) => void
}

function getFieldDetailSubscriptionKey(
  descriptor: FieldDetailSubscriptionDescriptor,
) {
  return `${descriptor.instanceId}\0${descriptor.path}\0${String(
    descriptor.includeRawValues,
  )}`
}

export function getFieldDetailInterestFields(
  fields: ReadonlyArray<DevtoolsMountedFieldSummary>,
  selectedFieldPath: string | null,
  pinnedFieldPaths: ReadonlyArray<string>,
): Array<DevtoolsMountedFieldSummary> {
  const fieldsByPath = new Map(fields.map((field) => [field.path, field]))
  const result: Array<DevtoolsMountedFieldSummary> = []
  const seenFieldPaths = new Set<string>()

  const addField = (fieldPath: string | null) => {
    if (fieldPath === null || seenFieldPaths.has(fieldPath)) return

    const field = fieldsByPath.get(fieldPath)
    if (!field) return

    seenFieldPaths.add(fieldPath)
    result.push(field)
  }

  addField(selectedFieldPath)
  for (const fieldPath of pinnedFieldPaths) {
    addField(fieldPath)
  }

  return result
}

export function getFieldDetailSubscriptionDescriptors(
  form: Pick<DevtoolsFormState, 'id' | 'instanceId'>,
  fields: ReadonlyArray<DevtoolsMountedFieldSummary>,
  includeArrayFields: boolean,
  includeRawValues: (field: DevtoolsMountedFieldSummary) => boolean,
): Array<FieldDetailSubscriptionDescriptor> {
  return fields
    .filter((field) => includeArrayFields || !field.isArray)
    .map((field) => ({
      id: form.id,
      instanceId: form.instanceId,
      path: field.path,
      includeRawValues: includeRawValues(field),
    }))
}

export function reconcileFieldDetailSubscriptions(
  previous: ReadonlyArray<FieldDetailSubscriptionDescriptor>,
  next: ReadonlyArray<FieldDetailSubscriptionDescriptor>,
  callbacks: ReconcileFieldDetailSubscriptionCallbacks,
): Array<FieldDetailSubscriptionDescriptor> {
  const previousByKey = new Map(
    previous.map((descriptor) => [
      getFieldDetailSubscriptionKey(descriptor),
      descriptor,
    ]),
  )
  const nextByKey = new Map(
    next.map((descriptor) => [
      getFieldDetailSubscriptionKey(descriptor),
      descriptor,
    ]),
  )

  for (const [key, descriptor] of previousByKey) {
    if (!nextByKey.has(key)) {
      callbacks.unsubscribe(descriptor)
    }
  }

  for (const [key, descriptor] of nextByKey) {
    if (!previousByKey.has(key)) {
      callbacks.subscribe(descriptor)
    }
  }

  return Array.from(nextByKey.values())
}
