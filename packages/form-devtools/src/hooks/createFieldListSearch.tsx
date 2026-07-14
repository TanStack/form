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
  PointerOffIcon,
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
import type { Accessor, ParentProps, Setter } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'

const mentionRegex = /(?:^|\s)@(\S*)/

type FieldFilterGroup =
  | 'dirty'
  | 'pinned'
  | 'valid'
  | 'mounted'
  | 'touched'
  | 'defaultValue'

export interface FieldListFilter {
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
    aliases: ['Not pristine', 'Not clean', 'Unclean', 'Changed'],
    description: 'Has been dirtied',
    icon: PencilIcon,
  },
  {
    label: 'Pristine',
    id: 'pristine',
    group: 'dirty',
    aliases: ['Not dirty', 'Clean', 'Unchanged'],
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
    icon: PointerOffIcon,
  },
]

function suggestFilters(
  query: string,
  suggestions: Array<FieldListFilter>,
): Array<FieldListFilter> {
  const keysResults = fuzzysort.go(query, suggestions, {
    keys: ['label', 'description', (filter) => filter.aliases?.join() ?? ''],
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

interface FieldListSearchArgs {
  query: Accessor<string>
  setQuery: Setter<string>
}

export function createFieldListSearch({
  query,
  setQuery,
}: FieldListSearchArgs) {
  const uid = createUniqueId()
  const ids = {
    input: `input_${uid}`,
    control: `control_${uid}`,
  }

  const [selectedTags, setSelectedTags] = createSignal<Array<FieldListFilter>>(
    [],
  )

  const activeMention = createMemo(() => {
    const match = query().match(mentionRegex)
    return match?.[1] ?? null
  })

  const remainingFilters = createMemo(() => {
    const selected = selectedTags()
    if (selected.length === 0) return allFieldFilters
    return allFieldFilters.filter((f) =>
      selected.every((s) => s.group !== f.group),
    )
  })

  const tagsCollection = useListCollection<FieldListFilter>({
    initialItems: remainingFilters(),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.id,
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

    inputValue: query(),
    onInputValueChange(details) {
      setQuery(details.inputValue)
    },

    delimiter: /$disable Delimeter/,
    addOnPaste: false,
    editable: false,
  }))

  function replaceActiveMention() {
    setQuery((prev) => prev.replace(mentionRegex, ''))
  }

  const comboboxApi = useCombobox(() => ({
    ids,

    collection: tagsCollection.collection(),

    inputValue: query(),
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

  const clearSelection = () => {
    setQuery('')
    setSelectedTags([])
  }

  const hasFilters = () => selectedTags().length > 0 || query().length > 0

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
    clearSelection,
    hasFilters,
    tagsSuggestions: () => tagsCollection.collection(),
  }
}
