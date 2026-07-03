import { Tabs } from '@ark-ui/solid'
import { Button } from '../ui/button'
import { TabIndicator } from './TabIndicator'
import type { ParentProps } from 'solid-js'

export type FormTabValue = 'field' | 'form' | 'validation'

function FormTabsRoot(props: ParentProps) {
  return (
    <Tabs.Root
      defaultValue={'field' satisfies FormTabValue}
      lazyMount
      unmountOnExit
    >
      {props.children}
    </Tabs.Root>
  )
}

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
          class="rounded-b-none h-10 pb-2 px-4 border-b-0 bg-transparent hover:bg-transparent"
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
    <FormTabsRoot>
      <Tabs.List class="inline-flex relative gap-2 z-0">
        <FormTabsTrigger value="field">Field</FormTabsTrigger>
        <FormTabsTrigger value="form">Form</FormTabsTrigger>
        <FormTabsTrigger value="validation">Validation</FormTabsTrigger>
        <TabIndicator />
      </Tabs.List>
    </FormTabsRoot>
  )
}
