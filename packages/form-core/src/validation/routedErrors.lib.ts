import { InternalFieldApi } from '../FieldApi/FieldApi.lib'
import { getOrCreateFieldApi } from '../FieldApi/fieldTraversal.lib'
import { getBy, nameToFieldNodeSegments } from '../utils.lib'
import { replaceSourceErrors } from './errorStorage.lib'
import { parseValidationResult } from './results/errors.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import type { ValidatorEvents } from '../pipeline/events.public'
import type { SubmissionAttempt } from '../submissionAttempt.lib'
import type {
  ValidationErrorSource,
  ValidationErrorTarget,
} from './errorStorage.lib'
import type {
  FormValidationResult,
  ValidationIssue,
} from './results/results.public'

interface RoutedValidationResultOptions<TValue> {
  routingRoot: AnyInternalFieldApi | InternalRootFieldApi
  value: TValue
  source: ValidationErrorSource
  result: FormValidationResult<TValue>
  sourceEvent: ValidatorEvents
  submission?: SubmissionAttempt
}

/** Resolves relative paths, combining errors captured by the same boundary. */
function resolveRoutedFieldErrors(
  fieldErrors: Iterable<readonly [string, Array<ValidationIssue>]>,
  routingRoot: AnyInternalFieldApi | InternalRootFieldApi,
): Map<ValidationErrorTarget, Array<ValidationIssue>> {
  const resolvedFieldErrors = new Map<
    AnyInternalFieldApi,
    Array<ValidationIssue>
  >()

  for (const [fieldName, errors] of fieldErrors) {
    const segments = nameToFieldNodeSegments(fieldName)
    let current = routingRoot

    let boundary: AnyInternalFieldApi | null = null
    if (!routingRoot._isRoot && routingRoot._errorBoundary) {
      boundary = routingRoot
    }

    for (const segment of segments) {
      const child: AnyInternalFieldApi | undefined = current._getChild(segment)
      if (!child) break

      if (child._errorBoundary) {
        boundary = child
      }
      current = child
    }

    if (!boundary) {
      boundary = getOrCreateFieldApi(
        routingRoot,
        segments.slice(),
        routingRoot.form,
        undefined,
        'internal',
      )
    }

    resolvedFieldErrors.set(
      boundary,
      (resolvedFieldErrors.get(boundary) ?? []).concat(errors),
    )
  }

  return resolvedFieldErrors
}

export function pruneErrorTargets(
  targets: Iterable<ValidationErrorTarget>,
): void {
  for (const target of targets) {
    if (target instanceof InternalFieldApi) target._pruneIfUnused()
  }
}

/** Replaces a form or group's complete error contribution. */
export function applyRoutedValidationResult<TValue>({
  routingRoot,
  value,
  source,
  result,
  sourceEvent,
  submission,
}: RoutedValidationResultOptions<TValue>): void {
  const parsed = parseValidationResult(result)
  const subfields = Object.entries(parsed.subfields ?? {})

  let matchingSubfields = subfields

  if (submission && !Object.is(value, submission.value)) {
    matchingSubfields = subfields.filter(([name]) =>
      Object.is(getBy(value, name), getBy(submission.value, name)),
    )
  }

  const resolved = resolveRoutedFieldErrors(matchingSubfields, routingRoot)

  pruneErrorTargets(
    replaceSourceErrors(source, sourceEvent, [
      [routingRoot, parsed.self ?? []],
      ...resolved,
    ]),
  )
}
