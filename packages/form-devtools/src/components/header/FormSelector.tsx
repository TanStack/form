import { For, createMemo } from 'solid-js'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  mountedForms,
  selectedForm,
  setRequestedFormId,
} from '@/stores/formSelectorStore'

interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export function FormSelector() {
  const noSelection = { value: '-', label: 'No forms', disabled: true }

  const formOptions = createMemo<Array<FormSelectOption>>(() => {
    const forms = mountedForms()
    if (forms.length === 0) return [noSelection]
    return forms.map((form) => ({
      value: form.instanceId,
      label: form.label,
    }))
  })

  const value = createMemo(() => {
    const selected = selectedForm()
    if (!selected) return [noSelection.value]
    return [selected.instanceId]
  })

  return (
    <Select
      value={value()}
      onValueChange={(details) => {
        setRequestedFormId(details.value[0] ?? null)
      }}
    >
      <SelectTrigger
        aria-label="Select form"
        class="rounded-l-none border-l-0 min-w-24"
      >
        <SelectValue placeholder="Select form" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Mounted forms</SelectLabel>
          <For each={formOptions()}>
            {(option) => (
              <SelectItem value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            )}
          </For>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
