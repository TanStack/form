import { Listbox } from '@ark-ui/solid'
import { ItemGroup } from '../../ui/item'
import { FieldListItems } from './FieldListItems'
import type { ListboxValueChangeDetails } from '@ark-ui/solid'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export function FieldList() {
  const { fieldList, formSelector } = useFormDevtoolsStore()

  const {
    fieldsListCollection,
    fieldRows,
    selectedFieldRow,
    setSelectedFieldPath,
  } = fieldList
  const { selectedForm } = formSelector

  const selectedRow = () => {
    const id = selectedFieldRow()?.fieldId
    if (id) return [id]
    return []
  }

  const emptyMessage = () => {
    if (!selectedForm()) return 'No form selected'
    if (fieldRows().length === 0) return 'No mounted fields'
    return 'No matching fields'
  }

  const handleRowSelect = (details: ListboxValueChangeDetails) => {
    const row = fieldsListCollection().items.find(
      (item) => item.fieldId === details.value[0],
    )
    if (row) setSelectedFieldPath(row.path)
  }

  return (
    <Listbox.Root
      collection={fieldsListCollection()}
      value={selectedRow()}
      onValueChange={handleRowSelect}
      selectionMode="single"
      deselectable
    >
      <Listbox.Empty class="flex w-full justify-center py-2 text-center text-sm text-muted-foreground">
        {emptyMessage()}
      </Listbox.Empty>
      <Listbox.Content
        asChild={(innerProps) => (
          <ItemGroup {...innerProps()} class="gap-2 outline-none" />
        )}
      >
        <FieldListItems />
      </Listbox.Content>
    </Listbox.Root>
  )
}
