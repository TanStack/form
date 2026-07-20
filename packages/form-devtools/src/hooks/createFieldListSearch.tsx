import {
  Combobox,
  TagsInput,
  createListCollection,
  useCombobox,
  useTagsInput,
} from '@ark-ui/solid'
import fuzzysort from 'fuzzysort'
import {
  BookmarkIcon,
  CheckIcon,
  EqualIcon,
  EqualNotIcon,
  EyeClosedIcon,
  EyeIcon,
  ListTreeIcon,
  PencilIcon,
  PencilSparklesIcon,
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
  onCleanup,
} from 'solid-js'
import type { Accessor, ParentProps, Setter } from 'solid-js'
import type { LucideIcon } from 'lucide-solid'
import type { FieldRowFilterPredicate } from '@/stores/fieldListStore'
import {
  createFieldSummaryFilterPredicate,
  isFieldPinned,
} from '@/stores/fieldListStore'

const mentionRegex = /(?:^|\s)@(\S*)/

type FieldFilterGroup =
  | 'dirty'
  | 'bookmarked'
  | 'valid'
  | 'mounted'
  | 'touched'
  | 'blurred'
  | 'defaultValue'

export interface FieldListFilter {
  id: string
  label: string
  group: FieldFilterGroup
  icon: LucideIcon
  description: string
  aliases?: Array<string>
  predicate?: FieldRowFilterPredicate
}

function createMountedFilterPredicate(
  predicate: FieldRowFilterPredicate,
): FieldRowFilterPredicate {
  predicate.bypassesDefaultInclusion = true
  return predicate
}

const allFieldFilters: Array<FieldListFilter> = [
  {
    label: 'Invalid',
    id: 'invalid',
    group: 'valid',
    aliases: ['Not valid', 'Errors'],
    description: 'Has shown or hidden errors',
    icon: XIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.validity !== 'valid',
    ),
  },
  {
    label: 'Valid',
    id: 'valid',
    group: 'valid',
    aliases: ['Not invalid', 'No errors'],
    description: 'Has no stored errors',
    icon: CheckIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.validity === 'valid',
    ),
  },
  {
    label: 'Dirty',
    id: 'dirty',
    group: 'dirty',
    aliases: ['Not pristine', 'Not clean', 'Unclean', 'Changed'],
    description: 'Has been dirtied',
    icon: PencilIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.isDirty,
    ),
  },
  {
    label: 'Pristine',
    id: 'pristine',
    group: 'dirty',
    aliases: ['Not dirty', 'Clean', 'Unchanged'],
    description: 'Has not been dirtied',
    icon: PencilSparklesIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => !summary.isDirty,
    ),
  },
  {
    label: 'Touched',
    id: 'touched',
    group: 'touched',
    aliases: ['Changed', 'Blurred'],
    description: 'Has been touched, either by change or blur',
    icon: PointerIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.isTouched,
    ),
  },
  {
    label: 'Untouched',
    id: 'untouched',
    group: 'touched',
    aliases: ['Not Changed', 'Not Blurred'],
    description: 'Has not been changed or blurred',
    icon: PointerOffIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => !summary.isTouched,
    ),
  },
  {
    label: 'Blurred',
    id: 'blurred',
    group: 'blurred',
    aliases: ['Was blurred', 'Visited'],
    description: 'Has lost focus at least once',
    icon: SquareIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.isBlurred,
    ),
  },
  {
    label: 'Not blurred',
    id: 'not-blurred',
    group: 'blurred',
    aliases: ['Never blurred', 'Not visited'],
    description: 'Was not focused or has not lost it yet',
    icon: SquareDashedIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => !summary.isBlurred,
    ),
  },
  {
    label: 'Default value',
    id: 'default-value',
    group: 'defaultValue',
    aliases: ['Initial value', 'Unchanged value', 'Same value'],
    description: 'Matches its default value',
    icon: EqualIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => summary.isDefaultValue,
    ),
  },
  {
    label: 'Non-default value',
    id: 'non-default-value',
    group: 'defaultValue',
    aliases: ['Modified value', 'Changed value', 'Different value'],
    description: 'Does not match its default value',
    icon: EqualNotIcon,
    predicate: createFieldSummaryFilterPredicate(
      (_field, summary) => !summary.isDefaultValue,
    ),
  },
  {
    label: 'Bookmarked',
    id: 'bookmarked',
    group: 'bookmarked',
    aliases: ['Pinned', 'Selected'],
    description: 'Is bookmarked in the devtools',
    icon: BookmarkIcon,
    predicate: (field) => isFieldPinned(field.fieldId),
  },
  {
    label: 'Rendered',
    id: 'mounted',
    group: 'mounted',
    aliases: ['Visible', 'Mounted'],
    description: 'Is mounted in a component',
    icon: EyeIcon,
    predicate: createMountedFilterPredicate(
      (field) => field.isMounted !== false,
    ),
  },
  {
    label: 'Not Rendered',
    id: 'unmounted',
    group: 'mounted',
    aliases: ['Invisible', 'Not mounted', 'Unrendered'],
    description: 'Is not currently mounted in a component',
    icon: EyeClosedIcon,
    predicate: createMountedFilterPredicate(
      (field) => field.isMounted === false,
    ),
  },
  {
    label: 'All',
    id: 'all',
    group: 'mounted',
    description: 'All registered fields, whether rendered or unrendered',
    icon: ListTreeIcon,
    predicate: createMountedFilterPredicate(() => true),
  },
]

function suggestFilters(
  query: string,
  suggestions: Array<FieldListFilter>,
): Array<FieldListFilter> {
  const keysResults = fuzzysort.go(query, suggestions, {
    keys: ['label', 'description', (filter) => filter.aliases?.join() ?? ''],
    all: true,
    threshold: 0.3,
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
  setFilterPipeline: Setter<Array<FieldRowFilterPredicate>>
}

export function createFieldListSearch({
  query,
  setQuery,
  setFilterPipeline,
}: FieldListSearchArgs) {
  const uid = createUniqueId()
  const ids = {
    input: `input_${uid}`,
    control: `control_${uid}`,
  }

  const [selectedTags, setSelectedTags] = createSignal<Array<FieldListFilter>>(
    [],
  )

  createEffect(() => {
    setFilterPipeline(
      selectedTags().flatMap((filter) =>
        filter.predicate ? [filter.predicate] : [],
      ),
    )
  })

  onCleanup(() => setFilterPipeline([]))

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

  const tagsCollection = createMemo(() =>
    createListCollection<FieldListFilter>({
      items: suggestFilters(activeMention() ?? '', remainingFilters()),
      itemToString: (item) => item.label,
      itemToValue: (item) => item.id,
    }),
  )

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

    collection: tagsCollection(),
    disableLayer: true,

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
    tagsSuggestions: tagsCollection,
  }
}
