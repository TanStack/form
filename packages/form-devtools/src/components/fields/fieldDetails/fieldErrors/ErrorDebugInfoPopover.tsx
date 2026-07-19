import { For, Show, createMemo } from 'solid-js'
import { fieldErrorDebugCases } from './debugCases'
import type { FieldErrorDebugDetails } from './debugCases'
import type { Accessor } from 'solid-js'
import type { DevtoolsFieldError } from '@/eventClientTypes'
import type { FieldId } from '@/types/branded'
import { Button } from '@/components/ui/button'
import { GitHubInvertocat } from '@/components/ui/github-invertocat'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
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
  caseIndex: number
}

interface DebugInfoProps {
  fieldId: FieldId
  error: DevtoolsFieldError
  dismissedDebugCases: Accessor<ReadonlySet<number>>
  onDismissDebugCase: (caseIndex: number) => void
}

export function DebugInfo(props: DebugInfoProps) {
  const store = useFormDevtoolsStore()
  const debug = createMemo(() => {
    const details: Array<EvaluatedFieldErrorDebugDetails> = []
    const context = {
      fieldId: props.fieldId,
      error: props.error,
      store,
    }

    for (let i = 0; i < fieldErrorDebugCases.length; i++) {
      const result = fieldErrorDebugCases[i]?.evaluate(context)
      if (result) details.push({ ...result, caseIndex: i })
    }

    return details
  })

  const remainingDebug = createMemo(() =>
    debug().filter(
      (details) => !props.dismissedDebugCases().has(details.caseIndex),
    ),
  )
  const currentDebug = createMemo(() => remainingDebug()[0])

  return (
    <Card class="ring-0">
      <CardHeader>
        <CardTitle>{currentDebug()?.title ?? 'Debugging'}</CardTitle>
        <Show when={!currentDebug()}>
          <CardDescription>No debugging guidance available</CardDescription>
        </Show>
        <CardAction>
          <Badge>Experimental</Badge>
        </CardAction>
      </CardHeader>
      <Show
        when={currentDebug()}
        fallback={
          <EmptyDebugDetails dismissedDebugCases={props.dismissedDebugCases} />
        }
      >
        {(data) => (
          <DebugDetails
            data={data}
            onDismissDebugCase={props.onDismissDebugCase}
          />
        )}
      </Show>
    </Card>
  )
}

interface EmptyDebugDetailsProps {
  dismissedDebugCases: Accessor<ReadonlySet<number>>
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
  onDismissDebugCase: (caseIndex: number) => void
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
          onClick={() => props.onDismissDebugCase(props.data().caseIndex)}
        >
          Not useful
        </Button>
      </CardFooter>
    </>
  )
}
