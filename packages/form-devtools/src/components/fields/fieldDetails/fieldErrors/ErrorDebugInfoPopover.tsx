import { For, Show, createMemo, createSignal, onCleanup } from 'solid-js'
import { getFieldErrorDebugDetails } from './suspicionViews'
import type { FieldErrorDebugDetails } from './suspicionViews'
import type { Accessor } from 'solid-js'
import type {
  DevtoolsFieldError,
  FieldErrorDebugReport,
  FieldErrorDebugSuspicion,
} from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { Button } from '@/components/ui/button'
import { GitHubInvertocat } from '@/components/ui/github-invertocat'
import { requestFieldErrorDebugReport } from '@/debugReports'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type EvaluatedFieldErrorDebugDetails = FieldErrorDebugDetails & {
  kind: FieldErrorDebugSuspicion['kind']
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
  const currentDebug = createMemo<EvaluatedFieldErrorDebugDetails | undefined>(
    () => {
      const suspicion = remainingSuspicions()[0]
      if (!suspicion) return undefined

      return {
        ...getFieldErrorDebugDetails(suspicion),
        kind: suspicion.kind,
      }
    },
  )

  return (
    <Card class="ring-0">
      <CardHeader>
        <CardTitle>{currentDebug()?.title ?? 'Debugging'}</CardTitle>
        <Show when={report() && !currentDebug()}>
          <CardDescription>No debugging guidance available</CardDescription>
        </Show>
        <CardAction>
          <Badge>Experimental</Badge>
        </CardAction>
      </CardHeader>
      <Show when={report()} fallback={<LoadingDebugDetails />}>
        <Show
          when={currentDebug()}
          fallback={
            <EmptyDebugDetails
              dismissedDebugCases={props.dismissedDebugCases}
            />
          }
        >
          {(data) => (
            <DebugDetails
              data={data}
              onDismissDebugCase={props.onDismissDebugCase}
            />
          )}
        </Show>
      </Show>
    </Card>
  )
}

function LoadingDebugDetails() {
  return (
    <CardContent class="text-sm text-muted-foreground">
      Investigating this error…
    </CardContent>
  )
}

interface EmptyDebugDetailsProps {
  dismissedDebugCases: Accessor<ReadonlySet<FieldErrorDebugSuspicion['kind']>>
}

function EmptyDebugDetails(props: EmptyDebugDetailsProps) {
  return (
    <>
      <CardContent>
        <Show
          when={props.dismissedDebugCases().size > 0}
          fallback={
            "We couldn't find anything unusual that would help explain this error. This screen can only provide guidance when an error matches a known suspicious pattern."
          }
        >
          The only patterns related to this error are no longer considered
          relevant, so there's nothing else for this screen to investigate.
        </Show>
      </CardContent>
      <CardFooter class="flex-col">
        <p class="text-sm text-muted-foreground">
          Think this error should be recognized in the future?
        </p>
        <Button
          variant="link"
          class="w-full text-foreground"
          asChild={(innerProps) => <a href="#" {...innerProps()} />}
        >
          <GitHubInvertocat /> Suggest a new check
        </Button>
      </CardFooter>
    </>
  )
}

interface DebugDetailsProps {
  data: Accessor<EvaluatedFieldErrorDebugDetails>
  onDismissDebugCase: (kind: FieldErrorDebugSuspicion['kind']) => void
}

function DebugDetails(props: DebugDetailsProps) {
  return (
    <>
      <CardContent class="flex flex-col gap-2">
        <Accordion
          defaultValue={['description']}
          class="border-border"
          collapsible
        >
          <AccordionItem value="description">
            <AccordionTrigger>What is the problem?</AccordionTrigger>
            <AccordionContent>{props.data().description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="commonCase">
            <AccordionTrigger>What is the common case?</AccordionTrigger>
            <AccordionContent>{props.data().commonCase}</AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="fixes"
            disabled={props.data().fixes.length === 0}
          >
            <AccordionTrigger>What can I do about it?</AccordionTrigger>
            <AccordionContent>
              <ul class="list-disc pl-4">
                <For each={props.data().fixes}>
                  {(suggestion) => <li>{suggestion}</li>}
                </For>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          class="w-full"
          onClick={() => props.onDismissDebugCase(props.data().kind)}
        >
          Not useful
        </Button>
      </CardFooter>
    </>
  )
}
