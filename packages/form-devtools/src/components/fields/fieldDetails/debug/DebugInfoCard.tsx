import { For, Show } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import type { EvaluatedDebugDetails } from './types'
import { Button } from '@/components/ui/button'
import { GitHubInvertocat } from '@/components/ui/github-invertocat'
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

export interface DebugInfoCopy {
  loading: JSX.Element
  empty: JSX.Element
  dismissed: JSX.Element
  suggestion: JSX.Element
}

interface DebugInfoCardProps<TKind extends string> {
  currentDebug: Accessor<EvaluatedDebugDetails<TKind> | undefined>
  isLoading: Accessor<boolean>
  hasDismissedDebugCases: Accessor<boolean>
  copy: DebugInfoCopy
  onDismissDebugCase: (kind: TKind) => void
}

export function DebugInfoCard<TKind extends string>(
  props: DebugInfoCardProps<TKind>,
) {
  return (
    <Card class="ring-0">
      <CardHeader>
        <CardTitle>{props.currentDebug()?.title ?? 'Debugging'}</CardTitle>
        <Show when={!props.isLoading() && !props.currentDebug()}>
          <CardDescription>No debugging guidance available</CardDescription>
        </Show>
        <CardAction>
          <Badge>Experimental</Badge>
        </CardAction>
      </CardHeader>
      <Show
        when={!props.isLoading()}
        fallback={
          <CardContent class="text-sm text-muted-foreground">
            {props.copy.loading}
          </CardContent>
        }
      >
        <Show
          when={props.currentDebug()}
          fallback={
            <EmptyDebugDetails
              hasDismissedDebugCases={props.hasDismissedDebugCases}
              copy={props.copy}
            />
          }
        >
          {(data) => (
            <DebugDetailsView
              data={data}
              onDismissDebugCase={props.onDismissDebugCase}
            />
          )}
        </Show>
      </Show>
    </Card>
  )
}

interface EmptyDebugDetailsProps {
  hasDismissedDebugCases: Accessor<boolean>
  copy: DebugInfoCopy
}

function EmptyDebugDetails(props: EmptyDebugDetailsProps) {
  return (
    <>
      <CardContent>
        <Show when={props.hasDismissedDebugCases()} fallback={props.copy.empty}>
          {props.copy.dismissed}
        </Show>
      </CardContent>
      <CardFooter class="flex-col">
        <p class="text-sm text-muted-foreground">{props.copy.suggestion}</p>
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

interface DebugDetailsViewProps<TKind extends string> {
  data: Accessor<EvaluatedDebugDetails<TKind>>
  onDismissDebugCase: (kind: TKind) => void
}

function DebugDetailsView<TKind extends string>(
  props: DebugDetailsViewProps<TKind>,
) {
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
          This isn't useful
        </Button>
      </CardFooter>
    </>
  )
}
