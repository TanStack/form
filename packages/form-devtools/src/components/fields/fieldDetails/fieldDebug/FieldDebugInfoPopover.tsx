import { createMemo, createSignal, onCleanup } from 'solid-js'
import { getFieldDebugDetails } from './suspicionViews'
import type { Accessor } from 'solid-js'
import type { EvaluatedDebugDetails } from '../debug/types'
import type { FieldDebugReport, FieldDebugSuspicion } from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { requestFieldDebugReport } from '@/debugReports'
import { DebugInfoCard } from '@/components/fields/fieldDetails/debug/DebugInfoCard'

const fieldDebugCopy = {
  loading: 'Investigating this field…',
  empty:
    "We couldn't find anything unusual that would help explain why this field has no errors. This screen can only provide guidance when a field matches a known suspicious pattern.",
  dismissed:
    "The only patterns related to this field are no longer considered relevant, so there's nothing else for this screen to investigate.",
  suggestion: 'Think this issue should be recognized in the future?',
}

interface FieldDebugInfoProps {
  formInstanceId: FormId
  fieldId: FieldId
  dismissedDebugCases: Accessor<ReadonlySet<FieldDebugSuspicion['kind']>>
  onDismissDebugCase: (kind: FieldDebugSuspicion['kind']) => void
}

export function FieldDebugInfo(props: FieldDebugInfoProps) {
  const [report, setReport] = createSignal<FieldDebugReport>()
  const cancelRequest = requestFieldDebugReport(
    {
      formInstanceId: props.formInstanceId,
      fieldId: props.fieldId,
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
    EvaluatedDebugDetails<FieldDebugSuspicion['kind']> | undefined
  >(() => {
    const suspicion = remainingSuspicions()[0]
    if (!suspicion) return undefined

    return {
      ...getFieldDebugDetails(suspicion),
      kind: suspicion.kind,
    }
  })

  return (
    <DebugInfoCard
      currentDebug={currentDebug}
      isLoading={() => report() === undefined}
      hasDismissedDebugCases={() => props.dismissedDebugCases().size > 0}
      copy={fieldDebugCopy}
      onDismissDebugCase={props.onDismissDebugCase}
    />
  )
}
