import { PenIcon, RotateCcwIcon, SquareArrowRightExitIcon } from 'lucide-solid'
import type { FieldId, FormId } from '@/types/branded'
import type { MenuSelectionDetails } from '@ark-ui/solid'
import { Button } from '@/components/ui/button'
import { formDevtoolsEventClient } from '@/eventClient.lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FieldDetailSettingsActionsProps {
  formInstanceId: FormId | null
  fieldId: FieldId
}

function EmitEventMenu(props: FieldDetailSettingsActionsProps) {
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
        asChild={(innerProps) => <Button variant="outline" {...innerProps()} />}
      >
        Emit event
      </DropdownMenuTrigger>
      <DropdownMenuContent class="font-mono">
        <DropdownMenuItem value="emit-change">
          <PenIcon />
          .handleChange(<span class="text-muted-foreground">…</span>)
        </DropdownMenuItem>
        <DropdownMenuItem value="emit-blur">
          <SquareArrowRightExitIcon />
          .handleBlur()
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem value="emit-reset" variant="destructive">
          <RotateCcwIcon />
          .reset()
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FieldDetailSettingsActions(
  props: FieldDetailSettingsActionsProps,
) {
  return (
    <>
      <EmitEventMenu {...props} />
    </>
  )
}
