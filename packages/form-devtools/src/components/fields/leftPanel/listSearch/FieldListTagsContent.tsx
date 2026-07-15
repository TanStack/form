import { Combobox } from '@ark-ui/solid'
import type { ParentProps } from 'solid-js'
import { Portal } from '@/components/ui/portal'

export function FieldListTagsContent(props: ParentProps) {
  return (
    <Portal>
      <Combobox.Positioner class="isolate z-50">
        <Combobox.Content
          data-slot="combobox-content"
          class="group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <Combobox.Empty
            data-slot="combobox-empty"
            class="hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex"
          >
            No matching tags
          </Combobox.Empty>
          <div
            data-slot="combobox-list"
            class="no-scrollbar max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0"
          >
            {props.children}
          </div>
        </Combobox.Content>
      </Combobox.Positioner>
    </Portal>
  )
}
