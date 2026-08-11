import { Show } from 'solid-js'
import EyeDashedIcon from 'lucide-solid/icons/eye-dashed'
import TimerIcon from 'lucide-solid/icons/timer'
import { FieldDetailErrorSourceText } from './FieldDetailErrorSourceText'
import type { Accessor } from 'solid-js'
import type { DevtoolsFieldError } from '@/eventClientTypes'
import { PopoverHeader, PopoverTitle } from '@/components/ui/popover'
import { JsonTree } from '@/components/ui/json-tree'
import { Code } from '@/components/ui/code'

interface ErrorExtraInfoPopoverProps {
  error: DevtoolsFieldError
  hasHiddenErrors: Accessor<boolean>
}

export function ErrorExtraInfoPopover({
  error,
  hasHiddenErrors,
}: ErrorExtraInfoPopoverProps) {
  return (
    <>
      <PopoverHeader>
        <PopoverTitle class="flex gap-1 items-center">
          <FieldDetailErrorSourceText source={error.source} />
        </PopoverTitle>
      </PopoverHeader>
      <div class="flex flex-col gap-2">
        <div class="flex item-center gap-2">
          <TimerIcon class="size-5" />
          <span>
            This error was set during <Code>{error.sourceEvent}</Code>
          </span>
        </div>
        <Show when={hasHiddenErrors()}>
          <div class="flex item-center gap-2">
            <EyeDashedIcon class="size-5" />
            <span>
              The error is stored, but not directly exposed in{' '}
              <Code>field.errors</Code>
            </span>
          </div>
        </Show>

        {/** PLAN Maybe say "Next expected removal is during change/blur"? */}
        <JsonTree value={error.error} defaultExpandedDepth={1} copyable />
      </div>
    </>
  )
}
