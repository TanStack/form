import { BugIcon, InfoIcon } from 'lucide-solid'
import { Match, Switch, createSignal } from 'solid-js'
import { FieldDetailErrorSourceText } from './FieldDetailErrorSourceText'
import { ErrorExtraInfoPopover } from './ErrorExtraInfoPopover'
import { DebugInfo } from './ErrorDebugInfoPopover'
import type { Accessor } from 'solid-js'
import type { DevtoolsFieldError } from '@/eventClientTypes'
import type { FieldId } from '@/types/branded'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface FieldDetailErrorItemProps {
  fieldId: FieldId
  error: DevtoolsFieldError
  hasHiddenErrors: Accessor<boolean>
}

export function FieldDetailErrorItem(props: FieldDetailErrorItemProps) {
  const [activePopover, setActivePopover] = createSignal<
    'debug' | 'info' | null
  >(null)
  const [dismissedDebugCases, setDismissedDebugCases] = createSignal<
    ReadonlySet<number>
  >(new Set())

  const dismissDebugCase = (caseIndex: number) => {
    setDismissedDebugCases((dismissed) => {
      if (dismissed.has(caseIndex)) return dismissed
      return new Set([...dismissed, caseIndex])
    })
  }

  return (
    <Popover
      positioning={{ placement: 'right-end' }}
      onTriggerValueChange={({ value }) => setActivePopover(value as never)}
    >
      <Item variant="outline">
        <ItemContent>
          <ItemTitle class="text-destructive truncate">
            {props.error.error.message}
          </ItemTitle>
          <ItemDescription class="flex gap-1 items-center">
            <FieldDetailErrorSourceText
              source={props.error.source}
              sourceEvent={props.error.sourceEvent}
            />
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <PopoverTrigger value="info">
            <InfoIcon class="size-5" />
          </PopoverTrigger>
          <PopoverTrigger value="debug">
            {/* TODO make muted if no debug is available */}
            <BugIcon class="size-5" />
          </PopoverTrigger>
        </ItemActions>
      </Item>
      <PopoverContent
        data-current={activePopover()}
        class="w-auto data-[current='info']:max-w-150 data-[current='debug']:max-w-100 data-[current='debug']:w-100 data-[current='debug']:p-0"
      >
        <Switch>
          <Match when={activePopover() === 'info'}>
            <ErrorExtraInfoPopover
              error={props.error}
              hasHiddenErrors={props.hasHiddenErrors}
            />
          </Match>
          <Match when={activePopover() === 'debug'}>
            <DebugInfo
              fieldId={props.fieldId}
              error={props.error}
              dismissedDebugCases={dismissedDebugCases}
              onDismissDebugCase={dismissDebugCase}
            />
          </Match>
        </Switch>
      </PopoverContent>
    </Popover>
  )
}
