import { BugIcon } from 'lucide-solid'
import { createSignal } from 'solid-js'
import { FieldDebugInfo } from '../fieldDebug/FieldDebugInfoPopover'
import type { FieldDebugSuspicion } from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface FieldNoErrorsItemProps {
  formInstanceId: FormId
  fieldId: FieldId
}

export function FieldNoErrorsItem(props: FieldNoErrorsItemProps) {
  const [dismissedDebugCases, setDismissedDebugCases] = createSignal<
    ReadonlySet<FieldDebugSuspicion['kind']>
  >(new Set())

  const dismissDebugCase = (kind: FieldDebugSuspicion['kind']) => {
    setDismissedDebugCases((dismissed) => {
      if (dismissed.has(kind)) return dismissed
      return new Set([...dismissed, kind])
    })
  }

  return (
    <Popover positioning={{ placement: 'right-end' }}>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>No error messages</ItemTitle>
        </ItemContent>
        <ItemActions>
          <PopoverTrigger aria-label="Debug field">
            <BugIcon class="size-5" />
          </PopoverTrigger>
        </ItemActions>
      </Item>
      <PopoverContent class="max-w-100 w-100 p-0">
        <FieldDebugInfo
          formInstanceId={props.formInstanceId}
          fieldId={props.fieldId}
          dismissedDebugCases={dismissedDebugCases}
          onDismissDebugCase={dismissDebugCase}
        />
      </PopoverContent>
    </Popover>
  )
}
