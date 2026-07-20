import { EllipsisIcon } from 'lucide-solid'
import { FieldDetailSettingsActions } from './FieldDetailSettingsActions'
import type { FieldDetailSettings } from '@/eventClientTypes'
import type { FieldId } from '@/types/branded'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderValue,
} from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { Separator } from '@/components/ui/separator'

interface FieldDetailSettingsMenuProps {
  fieldId: FieldId
  fieldPath: string
}

function formatDebounce({ value }: { value: number }) {
  if (!value) return 'Instant'
  return `${value}ms`
}

export function FieldDetailSettingsMenu({
  fieldId,
  fieldPath,
}: FieldDetailSettingsMenuProps) {
  const store = useFormDevtoolsStore()
  const { getFieldDetailSettings, updateFieldDetailSettings } =
    store.fieldDetails

  const settings = () => getFieldDetailSettings(fieldId)

  const patchSettings = (patch: Partial<FieldDetailSettings>) =>
    updateFieldDetailSettings(fieldId, patch)

  const debounceLabel = () => formatDebounce({ value: settings().debounceMs })

  return (
    <Popover positioning={{ placement: 'right' }}>
      <PopoverTrigger
        asChild={(innerProps) => (
          <Button variant="ghost" size="icon-sm" {...innerProps()} />
        )}
      >
        <EllipsisIcon />
      </PopoverTrigger>
      <PopoverContent class="min-w-32 p-3 flex flex-col gap-4">
        <PopoverHeader>
          <PopoverTitle>{fieldPath}</PopoverTitle>
          <PopoverDescription>Settings</PopoverDescription>
        </PopoverHeader>
        <Switch
          label="Listen for values data"
          checked={settings().includeValues}
          onCheckedChange={({ checked }) =>
            patchSettings({
              includeValues: checked,
            })
          }
        />
        <div class="grid gap-2">
          <Label>Error payload</Label>
          <Select
            value={[settings().errorPayloadMode]}
            onValueChange={({ value }) => {
              const errorPayloadMode = value[0]
              if (
                errorPayloadMode === 'full' ||
                errorPayloadMode === 'messages'
              ) {
                patchSettings({
                  errorPayloadMode,
                })
              }
            }}
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select error payload" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="messages">Messages only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SliderRoot
          class="mx-auto w-full max-w-xs"
          value={[settings().debounceMs]}
          onValueChange={({ value }) =>
            patchSettings({
              debounceMs: value[0] ?? 0,
            })
          }
          getAriaValueText={formatDebounce}
          min={0}
          max={500}
          step={50}
        >
          <SliderLabel>Detail debounce</SliderLabel>
          <SliderValue>{debounceLabel()}</SliderValue>
          <SliderControl />
        </SliderRoot>
        <Separator />

        <FieldDetailSettingsActions
          formInstanceId={store.fieldList.subscribedFormId()}
          fieldId={fieldId}
        />
      </PopoverContent>
    </Popover>
  )
}
