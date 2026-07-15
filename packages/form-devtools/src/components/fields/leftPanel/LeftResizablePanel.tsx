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
        'ring-offset-background focus-visible:ring-1 focus-visible:ring-border relative flex w-px items-center justify-center bg-border  after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2   focus-visible:outline-hidden data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2 [&[data-orientation=vertical]>div]:rotate-90',
        local.class,
      )}
      {...others}
    >
      <Splitter.ResizeTriggerIndicator class="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
    </Splitter.ResizeTrigger>
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
        class={cn('size-full', props.class)}
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
