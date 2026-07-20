import { createMemo, createSignal, onCleanup } from 'solid-js'
import { getFieldErrorDebugDetails } from './suspicionViews'
import type { Accessor } from 'solid-js'
import type { EvaluatedDebugDetails } from '../debug/types'
import type {
  DevtoolsFieldError,
  FieldErrorDebugReport,
  FieldErrorDebugSuspicion,
} from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { requestFieldErrorDebugReport } from '@/debugReports'
import { DebugInfoCard } from '@/components/fields/fieldDetails/debug/DebugInfoCard'

const errorDebugCopy = {
  loading: 'Investigating this error…',
  empty:
    "We couldn't find anything unusual that would help explain this error. This screen can only provide guidance when an error matches a known suspicious pattern.",
  dismissed:
    "The only patterns related to this error are no longer considered relevant, so there's nothing else for this screen to investigate.",
  suggestion: 'Think this error should be recognized in the future?',
}

interface DebugInfoProps {
  formInstanceId: FormId
  fieldId: FieldId
  error: DevtoolsFieldError
  dismissedDebugCases: Accessor<ReadonlySet<FieldErrorDebugSuspicion['kind']>>
  onDismissDebugCase: (kind: FieldErrorDebugSuspicion['kind']) => void
}

export function DebugInfo(props: DebugInfoProps) {
  const [report, setReport] = createSignal<FieldErrorDebugReport>()
  const cancelRequest = requestFieldErrorDebugReport(
    {
      formInstanceId: props.formInstanceId,
      fieldId: props.fieldId,
      error: props.error,
    },
    setReport,
  )
  onCleanup(cancelRequest)

  const remainingSuspicions = createMemo(() =>
    (report()?.suspicions ?? []).filter(
      (suspicion) => !props.dismissedDebugCases().has(suspicion.kind),
    ),
  )
  const currentDebug = createMemo<
    EvaluatedDebugDetails<FieldErrorDebugSuspicion['kind']> | undefined
  >(() => {
    const suspicion = remainingSuspicions()[0]
    if (!suspicion) return undefined

    return {
      ...getFieldErrorDebugDetails(suspicion),
      kind: suspicion.kind,
    }
  })

  return (
    <DebugInfoCard
      currentDebug={currentDebug}
      isLoading={() => report() === undefined}
      hasDismissedDebugCases={() => props.dismissedDebugCases().size > 0}
      copy={errorDebugCopy}
      onDismissDebugCase={props.onDismissDebugCase}
    />
  )
}
