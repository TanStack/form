import {
  PenIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareArrowRightExitIcon,
} from 'lucide-solid'
import type { FieldId, FormId } from '@/types/branded'
import type { MenuSelectionDetails } from '@ark-ui/solid'
import { Button } from '@/components/ui/button'
import { formDevtoolsEventClient } from '@/eventClient.lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FieldDetailSettingsActionsProps {
  fieldId: FieldId
  formInstanceId: FormId | null
}

export function FieldDetailSettingsActions(
  props: FieldDetailSettingsActionsProps,
) {
  const emitRequest = (
    eventName:
      | 'field-handle-change-request'
      | 'field-handle-blur-request'
      | 'field-reset-request',
  ) => {
    if (!props.formInstanceId) return

    formDevtoolsEventClient.emit(eventName, {
      formInstanceId: props.formInstanceId,
      fieldId: props.fieldId,
    })
  }

  const handleDropdownSelect = ({ value }: MenuSelectionDetails) => {
    switch (value) {
      case 'emit-change':
        return emitRequest('field-handle-change-request')
      case 'emit-blur':
        return emitRequest('field-handle-blur-request')
      case 'emit-reset':
        return emitRequest('field-reset-request')
      default:
        break
    }
  }

  return (
    <DropdownMenu
      positioning={{ placement: 'top', slide: true }}
      onSelect={handleDropdownSelect}
    >
      <DropdownMenuTrigger
        aria-label="Emit event"
        asChild={(innerProps) => (
          <Button variant="ghost" size="icon-sm" {...innerProps()} />
        )}
      >
        <PlayIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="font-mono">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem value="emit-change" class="cursor-pointer">
            <PenIcon />
            .handleChange(<span class="text-muted-foreground">…</span>)
          </DropdownMenuItem>
          <DropdownMenuItem value="emit-blur" class="cursor-pointer">
            <SquareArrowRightExitIcon />
            .handleBlur()
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="emit-reset"
            variant="destructive"
            class="cursor-pointer"
          >
            <RotateCcwIcon />
            .reset()
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
