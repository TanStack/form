import { For, createMemo } from 'solid-js'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useFormSelector } from '@/contexts/formSelectorContext'

interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export function FormSelector() {
  const { mountedForms, selectedFormInstanceId, setSelectedForm } =
    useFormSelector()
  const formOptions = createMemo<Array<FormSelectOption>>(() => {
    const forms = mountedForms()
    const formIdCounts = new Map<string, number>()

    for (const form of forms) {
      formIdCounts.set(form.formId, (formIdCounts.get(form.formId) ?? 0) + 1)
    }

    if (forms.length === 0) {
      return [{ value: '-', label: 'No forms', disabled: true }]
    }

    return forms.map((form) => ({
      value: form.instanceId,
      label:
        (formIdCounts.get(form.formId) ?? 0) > 1
          ? `${form.formId} (${form.instanceId.slice(0, 8)})`
          : form.formId,
    }))
  })
  const selectedValue = createMemo(
    () => selectedFormInstanceId() ?? formOptions()[0]?.value ?? '-',
  )

  return (
    <Select
      value={[selectedValue()]}
      onValueChange={(details) => {
        setSelectedForm(details.value[0] ?? null)
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
