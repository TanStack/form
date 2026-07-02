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
import { useFormEventClient } from '@/contexts/eventClientContext'
import { getDevtoolsFormKey } from '@/stores/eventClientTypes'

interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export function FormSelector() {
  const { activeFormKey, selectForm, store } = useFormEventClient()
  const formOptions = createMemo<Array<FormSelectOption>>(() => {
    const forms = store()
    const formIdCounts = new Map<string, number>()

    for (const form of forms) {
      formIdCounts.set(form.id, (formIdCounts.get(form.id) ?? 0) + 1)
    }

    if (forms.length === 0) {
      return [{ value: '-', label: 'No forms', disabled: true }]
    }

    return forms.map((form) => ({
      value: getDevtoolsFormKey(form),
      label:
        (formIdCounts.get(form.id) ?? 0) > 1
          ? `${form.id} (${form.instanceId.slice(0, 8)})`
          : form.id,
    }))
  })
  const selectedForm = createMemo(
    () => activeFormKey() ?? formOptions()[0]?.value ?? '-',
  )

  return (
    <Select
      value={[selectedForm()]}
      onValueChange={(details) => {
        selectForm(details.value[0] ?? null)
      }}
      class="me-auto ms-5"
    >
      <SelectTrigger aria-label="Select form">
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
