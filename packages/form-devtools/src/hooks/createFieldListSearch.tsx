import {
  Combobox,
  TagsInput,
  useCombobox,
  useListCollection,
  useTagsInput,
} from '@ark-ui/solid'
import fuzzysort from 'fuzzysort'
import {
  CheckIcon,
  PencilIcon,
  PencilSparklesIcon,
  PinIcon,
  PointerIcon,
  SquareDashedIcon,
  SquareIcon,
  XIcon,
} from 'lucide-solid'
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
} from 'solid-js'
import type { ParentProps } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'

const mentionRegex = /(?:^| )@(\w*)$/

type FieldFilterGroup =
  | 'dirty'
  | 'pinned'
  | 'valid'
  | 'mounted'
  | 'touched'
  | 'defaultValue'

interface FieldListFilter {
  id: string
  label: string
  group: FieldFilterGroup
  icon: LucideIcon
  description: string
  aliases?: Array<string>
  // TODO add
  // predicate: (field: any) => boolean
}

const allFieldFilters: Array<FieldListFilter> = [
  {
    label: 'Pinned',
    id: 'pinned',
    group: 'pinned',
    description: 'Is pinned in the devtools',
    icon: PinIcon,
  },
  {
    label: 'Mounted',
    id: 'mounted',
    group: 'mounted',
    aliases: ['Visible'],
    description: 'Is rendered in a component',
    icon: SquareIcon,
  },
  {
    label: 'Unmounted',
    id: 'unmounted',
    group: 'mounted',
    aliases: ['Invisible', 'Not mounted'],
    description: 'Is not currently rendered',
    icon: SquareDashedIcon,
  },
  {
    label: 'Invalid',
    id: 'invalid',
    group: 'valid',
    aliases: ['Not valid', 'Errors'],
    description: 'Has shown or hidden errors',
    icon: XIcon,
  },
  {
    label: 'Valid',
    id: 'valid',
    group: 'valid',
    aliases: ['Not invalid', 'No errors'],
    description: 'Has no stored errors',
    icon: CheckIcon,
  },
  {
    label: 'Dirty',
    id: 'dirty',
    group: 'dirty',
    aliases: ['Not pristine', 'Not clean', 'Unclean'],
    description: 'Has been dirtied',
    icon: PencilIcon,
  },
  {
    label: 'Pristine',
    id: 'pristine',
    group: 'dirty',
    aliases: ['Not dirty', 'Clean'],
    description: 'Has not been dirtied',
    icon: PencilSparklesIcon,
  },
  {
    label: 'Touched',
    id: 'touched',
    group: 'touched',
    aliases: ['Changed', 'Blurred'],
    description: 'Has been touched, either by change or blur',
    icon: PointerIcon,
  },
  {
    label: 'Untouched',
    id: 'untouched',
    group: 'touched',
    aliases: ['Not Changed', 'Not Blurred'],
    description: 'Has not been changed or blurred',
    icon: PointerIcon,
  },
]

function suggestFilters(
  query: string,
  suggestions: Array<FieldListFilter>,
): Array<FieldListFilter> {
  const keysResults = fuzzysort.go(query, suggestions, {
    keys: ['label', 'description', (filter) => filter.aliases?.join() ?? ''],
    limit: 8,
    all: true,
    scoreFn: (results) => {
      const labelScore = results[0]?.score ?? 0
      const descriptionScore = results[1]?.score ?? 0
      const aliasScore = results[2]?.score ?? 0

      return Math.max(labelScore, aliasScore * 0.85, descriptionScore * 0.5)
    },
  })
  return keysResults.map((result) => result.obj)
}

function getFilters(selection: Array<string>): Array<FieldListFilter> {
  return selection
    .map((s) => allFieldFilters.find((filter) => filter.id === s))
    .filter((filter) => filter !== undefined)
}

export function createFieldListSearch() {
  const uid = createUniqueId()
  const ids = {
    input: `input_${uid}`,
    control: `control_${uid}`,
  }

  const [text, setText] = createSignal('')
  const [selectedTags, setSelectedTags] = createSignal<Array<FieldListFilter>>(
    [],
  )

  const activeMention = createMemo(() => {
    const match = text().match(mentionRegex)
    return match?.[1] ?? null
  })

  const remainingFilters = createMemo(() => {
    const selected = selectedTags()
    if (selected.length === 0) return allFieldFilters
    return allFieldFilters.filter((f) =>
      selected.some((s) => s.group !== f.group),
    )
  })

  const tagsCollection = useListCollection<FieldListFilter>({
    initialItems: remainingFilters(),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.id,
    limit: 8,
  })

  createEffect(() => {
    tagsCollection.set(
      suggestFilters(activeMention() ?? '', remainingFilters()),
    )
  })

  const tagsInputApi = useTagsInput(() => ({
    ids,

    value: selectedTags().map((v) => v.id),

    onValueChange(details) {
      setSelectedTags(getFilters(details.value))
    },

    inputValue: text(),
    onInputValueChange(details) {
      setText(details.inputValue)
    },

    delimiter: /$disable Delimeter/,
    addOnPaste: false,
    editable: false,
  }))

  function replaceActiveMention() {
    setText((prev) => prev.replace(mentionRegex, ''))
  }

  const comboboxApi = useCombobox(() => ({
    ids,

    collection: tagsCollection.collection(),

    inputValue: text(),
    value: [],

    open: activeMention() !== null,
    openOnClick: false,
    openOnKeyPress: false,

    allowCustomValue: true,
    inputBehavior: 'autohighlight',
    selectionBehavior: 'preserve',

    onValueChange(details) {
      const selected = details.value[0]

      if (!selected) return

      tagsInputApi().addValue(selected)
      replaceActiveMention()
    },

    scrollToIndexFn: ({ getElement }) => {
      requestAnimationFrame(() => {
        getElement()?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'auto',
        })
      })
    },
  }))

  function Provider(props: ParentProps) {
    return (
      <TagsInput.RootProvider value={tagsInputApi}>
        <Combobox.RootProvider value={comboboxApi}>
          {props.children}
        </Combobox.RootProvider>
      </TagsInput.RootProvider>
    )
  }

  return {
    tagsInputApi,
    comboboxApi,
    Provider,
    selectedTags,
    tagsSuggestions: () => tagsCollection.collection(),
  }
}
