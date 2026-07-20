import { Tabs } from '@ark-ui/solid'
import { Show } from 'solid-js'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { TabIndicator } from './TabIndicator'
import type { ParentProps } from 'solid-js'

export type FormTabValue = 'field' | 'form' | 'validation'

interface FormTabsTriggerProps extends ParentProps {
  value: FormTabValue
}

function FormTabsTrigger(props: FormTabsTriggerProps) {
  return (
    <Tabs.Trigger
      value={props.value}
      asChild={(props) => (
        <Button
          variant="ghost"
          class="rounded-b-none h-10 pb-2 px-4 border-b-0 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
          {...props()}
        ></Button>
      )}
    >
      {props.children}
    </Tabs.Trigger>
  )
}

export function TabsNav() {
  return (
    <Tabs.List class="inline-flex relative gap-2 z-0">
      <FormTabsTrigger value="field">Field</FormTabsTrigger>
      <FormTabsTrigger value="form">Form</FormTabsTrigger>
      <FormTabsTrigger value="validation">Group</FormTabsTrigger>
      <TabIndicator />
    </Tabs.List>
  )
}

interface DevtoolsTabProps extends ParentProps {
  value: FormTabValue
  disableScroll?: boolean
}

export function DevtoolsTab(props: DevtoolsTabProps) {
  return (
    <Tabs.Content
      class="min-h-0 flex-1"
      value={props.value}
      asChild={(props) => <main {...props()} class="overflow-hidden" />}
    >
      <Show when={!props.disableScroll} fallback={props.children}>
        <ScrollArea class="size-full">{props.children}</ScrollArea>
      </Show>
    </Tabs.Content>
  )
}
