import { Splitter } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import type { ParentProps } from 'solid-js'
import type { SplitterResizeTriggerProps } from '@ark-ui/solid'
import { cn } from '@/utils'

function SidebarRail(props: SplitterResizeTriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <Splitter.ResizeTrigger
      class={cn(
        'outline-none z-20 hidden w-2 transition-all ease-linear after:absolute after:inset-y-0 after:inset-s-1/2 after:w-2 hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 cursor-col-resize',
        local.class,
      )}
      {...others}
    />
  )
}

interface LeftResizablePanelProps extends ParentProps {
  sidebarPanelId: string
  mainPanelId: string
  class?: string
}

export function LeftResizablePanel(props: LeftResizablePanelProps) {
  return (
    <>
      <Splitter.Panel
        id={props.sidebarPanelId}
        class={cn('size-full bg-sidebar p-2', props.class)}
      >
        {props.children}
      </Splitter.Panel>
      <SidebarRail
        id={`${props.sidebarPanelId}:${props.mainPanelId}`}
        aria-label="Resize"
      />
    </>
  )
}
