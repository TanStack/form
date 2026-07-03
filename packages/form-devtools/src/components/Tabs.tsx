import { Tabs } from '@ark-ui/solid'
import type { ParentProps } from 'solid-js'
import { cn } from '@/utils'

export type FormTabValue = 'field' | 'form' | 'validation'

export function FormTabsRoot(props: ParentProps) {
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
        <button
          class={cn(
            "inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            'h-8 gap-1.5 px-2.5 bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50',
            'border-2 border-border dark:border-input',
            'data-selected:border-b-transparent',
            'rounded-lg rounded-b-none',
          )}
          {...props()}
        />
      )}
    >
      {props.children}
    </Tabs.Trigger>
  )
}

export function FormTabsList() {
  return (
    <Tabs.List class="flex gap-2 -mb-[2px]">
      <FormTabsTrigger value="field">Field</FormTabsTrigger>
      <FormTabsTrigger value="form">Form</FormTabsTrigger>
      <FormTabsTrigger value="validation">Validation</FormTabsTrigger>
    </Tabs.List>
  )
}

interface TabContentProps extends ParentProps {
  value: FormTabValue
}

export function FormTabContent(props: TabContentProps) {
  return (
    <Tabs.Content
      value={props.value}
      class="border-t-2 border-border dark:border-input"
    >
      {props.children}
    </Tabs.Content>
  )
}
