import {
  For,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js'
import { Header, HeaderLogo } from '@tanstack/devtools-ui'
import { useFormEventClient } from '../contexts/eventClientContext'
import { useResizablePanel } from '../hooks/useResizablePanel'
import {
  getFieldDetailInterestFields,
  getFieldDetailSubscriptionDescriptors,
  reconcileFieldDetailSubscriptions,
} from '../stores/fieldDetailSubscriptions'
import { getDevtoolsFormKey } from '../stores/eventClientTypes'
import { useShellStyles } from '../styles/shell.styles'
import { DetailPanelContent, LeftPanelContent } from './ShellPanels'
import {
  areFieldSelectionIdentitiesEqual,
  areFieldSelectionIdentityArraysEqual,
  createFieldSelectionIdentity,
  resolveFieldSelectionIdentities,
  resolveFieldSelectionIdentity,
} from './fieldSelectionIdentity'
import { getVisibleFieldDetailItems } from './fieldDetailItems'
import { devtoolsTabs } from './shellTabs'
import type { FieldDetailSubscriptionDescriptor } from '../stores/fieldDetailSubscriptions'
import type { FieldListFilter } from './MountedFieldsList'
import type { FieldSelectionIdentity } from './fieldSelectionIdentity'
import type { ResizablePanelArgs } from '../hooks/useResizablePanel'
import type { DevtoolsTabId } from './shellTabs'
import type { FieldDetailCardItem } from './FieldDetailCard/fieldDetailTypes'

const includeArrayFieldDetails = true

const leftPanelWidth: ResizablePanelArgs = {
  defaultPx: 300,
  minPx: 150,
  maxPx: 800,
} as const

interface FormSelectOption {
  value: string
  label: string
}

interface ShellProps {
  adapterName?: string
}

function getFieldRawValueOverrideKey(formKey: string, path: string) {
  return `${formKey}\0${path}`
}

export function Shell(props: ShellProps) {
  const styles = useShellStyles()
  const {
    activeForm,
    activeFormKey,
    requestFieldDetailSubscribe,
    requestFieldDetailUnsubscribe,
    selectForm,
    store,
  } = useFormEventClient()
  const leftPanel = useResizablePanel(leftPanelWidth)
  const [activeTab, setActiveTab] = createSignal<DevtoolsTabId>('overview')
  const [fieldQuery, setFieldQuery] = createSignal('')
  const [fieldFilter, setFieldFilter] = createSignal<FieldListFilter>('all')
  const [selectedField, setSelectedField] =
    createSignal<FieldSelectionIdentity | null>(null)
  const [pinnedFields, setPinnedFields] = createSignal<
    Array<FieldSelectionIdentity>
  >([])
  const [fieldRawValueOverrides, setFieldRawValueOverrides] = createSignal<
    Record<string, boolean>
  >({})
  const activeTabConfig = createMemo(
    () => devtoolsTabs.find((tab) => tab.id === activeTab()) ?? devtoolsTabs[0],
  )
  const formOptions = createMemo<Array<FormSelectOption>>(() => {
    const forms = store()
    const formIdCounts = new Map<string, number>()

    for (const form of forms) {
      formIdCounts.set(form.id, (formIdCounts.get(form.id) ?? 0) + 1)
    }

    if (forms.length === 0) {
      return [{ value: '-', label: 'No forms' }]
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
  const mountedFields = createMemo(() => activeForm()?.mountedFields ?? [])
  const mountedFieldPaths = createMemo(
    () => new Set(mountedFields().map((field) => field.path)),
  )
  const selectedFieldPath = createMemo(() => selectedField()?.path ?? null)
  const pinnedFieldPaths = createMemo(() =>
    pinnedFields().map((field) => field.path),
  )
  const fieldDetailInterestFields = createMemo(() =>
    getFieldDetailInterestFields(
      mountedFields(),
      selectedFieldPath(),
      pinnedFieldPaths(),
    ),
  )
  const fieldRawValueByPath = createMemo(() => {
    const form = activeForm()
    const overrides = fieldRawValueOverrides()
    const valuesByPath = new Map<string, boolean>()

    if (!form) return valuesByPath

    const formKey = getDevtoolsFormKey(form)

    for (const field of fieldDetailInterestFields()) {
      valuesByPath.set(
        field.path,
        overrides[getFieldRawValueOverrideKey(formKey, field.path)] ?? true,
      )
    }

    return valuesByPath
  })
  const visibleDetailFields = createMemo<ReadonlyArray<FieldDetailCardItem>>(
    () => {
      const form = activeForm()
      if (!form) return []

      return getVisibleFieldDetailItems(
        fieldDetailInterestFields(),
        form.fieldDetails,
        includeArrayFieldDetails,
      )
    },
  )
  let fieldDetailSubscriptions: Array<FieldDetailSubscriptionDescriptor> = []
  let previousSelectionFormKey: string | null | undefined
  let formSelectRef: HTMLSelectElement | undefined

  const selectFieldPath = (fieldPath: string) => {
    const field = mountedFields().find((item) => item.path === fieldPath)
    if (!field) return

    setSelectedField(createFieldSelectionIdentity(field))
  }

  const togglePinnedFieldPath = (fieldPath: string) => {
    const field = mountedFields().find((item) => item.path === fieldPath)
    if (!field) return

    const identity = createFieldSelectionIdentity(field)
    setPinnedFields((fields) => {
      const isPinned = fields.some(
        (item) =>
          item.fieldId === identity.fieldId || item.path === identity.path,
      )

      return isPinned
        ? fields.filter(
            (item) =>
              item.fieldId !== identity.fieldId && item.path !== identity.path,
          )
        : [...fields, identity]
    })
  }

  const setFieldRawValuePreference = (
    fieldPath: string,
    includeRawValues: boolean,
  ) => {
    const form = activeForm()
    if (!form) return

    const overrideKey = getFieldRawValueOverrideKey(
      getDevtoolsFormKey(form),
      fieldPath,
    )

    setFieldRawValueOverrides((overrides) => {
      if (!includeRawValues) {
        return {
          ...overrides,
          [overrideKey]: false,
        }
      }

      const nextOverrides = { ...overrides }
      delete nextOverrides[overrideKey]
      return nextOverrides
    })
  }

  createEffect(() => {
    const formKey = activeFormKey()

    if (previousSelectionFormKey === undefined) {
      previousSelectionFormKey = formKey
      return
    }

    if (previousSelectionFormKey !== formKey) {
      previousSelectionFormKey = formKey
      setSelectedField(null)
      setPinnedFields([])
    }
  })

  createEffect(() => {
    const selected = selectedForm()
    formOptions()

    if (formSelectRef && formSelectRef.value !== selected) {
      formSelectRef.value = selected
    }
  })

  createEffect(() => {
    const fields = mountedFields()
    if (fields.length === 0) return

    const selected = selectedField()
    const nextSelected =
      selected === null
        ? createFieldSelectionIdentity(fields[0]!)
        : (resolveFieldSelectionIdentity(fields, selected) ?? selected)

    if (!areFieldSelectionIdentitiesEqual(selected, nextSelected)) {
      setSelectedField(nextSelected)
    }

    setPinnedFields((identities) => {
      const nextIdentities = resolveFieldSelectionIdentities(fields, identities)

      return areFieldSelectionIdentityArraysEqual(identities, nextIdentities)
        ? identities
        : nextIdentities
    })
  })

  createEffect(() => {
    const form = activeForm()
    const nextSubscriptions =
      activeTab() === 'fields' && form
        ? getFieldDetailSubscriptionDescriptors(
            form,
            fieldDetailInterestFields(),
            includeArrayFieldDetails,
            (field) => fieldRawValueByPath().get(field.path) ?? true,
          )
        : []

    fieldDetailSubscriptions = reconcileFieldDetailSubscriptions(
      fieldDetailSubscriptions,
      nextSubscriptions,
      {
        subscribe: (descriptor) =>
          requestFieldDetailSubscribe({
            ...descriptor,
            includeArrayFields: includeArrayFieldDetails,
          }),
        unsubscribe: requestFieldDetailUnsubscribe,
      },
    )
  })

  onCleanup(() => {
    fieldDetailSubscriptions = reconcileFieldDetailSubscriptions(
      fieldDetailSubscriptions,
      [],
      {
        subscribe: () => {},
        unsubscribe: requestFieldDetailUnsubscribe,
      },
    )
  })

  return (
    <>
      <Header>
        <HeaderLogo
          flavor={{ light: '#eeaf00', dark: '#eeaf00' }}
          onClick={() => {
            window.open(
              'https://tanstack.com/form/latest/docs/overview',
              '_blank',
            )
          }}
        >
          {props.adapterName ? `${props.adapterName} ` : ''}Form v2
        </HeaderLogo>
        <select
          ref={formSelectRef}
          aria-label="Select form"
          value={selectedForm()}
          onInput={(event) => {
            const nextFormKey = event.currentTarget.value
            selectForm(nextFormKey)
            event.currentTarget.value = nextFormKey
          }}
        >
          <For each={formOptions()}>
            {(option) => <option value={option.value}>{option.label}</option>}
          </For>
        </select>
      </Header>

      <div
        class={styles().tabBar}
        role="tablist"
        aria-label="Form devtools sections"
      >
        <For each={devtoolsTabs}>
          {(tab, index) => (
            <button
              id={`form-devtools-tab-${tab.id}`}
              class={styles().tabButton}
              classList={{
                [styles().tabButtonActive]: activeTab() === tab.id,
                [styles().tabButtonActiveFirst]:
                  activeTab() === tab.id && index() === 0,
              }}
              type="button"
              role="tab"
              aria-selected={activeTab() === tab.id}
              aria-controls="form-devtools-active-panel"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>

      <div
        id="form-devtools-active-panel"
        class={styles().mainContainer}
        classList={{
          [styles().mainContainerFirstTabActive]:
            activeTab() === devtoolsTabs[0].id,
        }}
        role="tabpanel"
        aria-labelledby={`form-devtools-tab-${activeTab()}`}
      >
        <div
          class={styles().leftPanel}
          style={{
            width: `${leftPanel.width()}px`,
            'min-width': `${leftPanelWidth.minPx}px`,
            'max-width': `${leftPanelWidth.maxPx}px`,
          }}
        >
          <LeftPanelContent
            activeTab={activeTab()}
            tabConfig={activeTabConfig()}
            fieldQuery={fieldQuery()}
            fieldFilter={fieldFilter()}
            fields={mountedFields()}
            selectedFieldPath={selectedFieldPath()}
            pinnedFieldPaths={pinnedFieldPaths()}
            onQueryChange={setFieldQuery}
            onFilterChange={setFieldFilter}
            onSelectField={selectFieldPath}
            onTogglePinnedField={togglePinnedFieldPath}
          />
        </div>

        <div
          class={`${styles().dragHandle} ${
            leftPanel.isDragging() ? 'dragging' : ''
          }`}
          onMouseDown={leftPanel.startResize}
        />

        <div class={styles().rightPanel} style={{ flex: 1 }}>
          <DetailPanelContent
            activeTab={activeTab()}
            tabConfig={activeTabConfig()}
            selectedFieldPath={selectedFieldPath()}
            mountedFieldPaths={mountedFieldPaths()}
            onOpenField={selectFieldPath}
            rawValueByFieldPath={fieldRawValueByPath()}
            onRawValueChange={setFieldRawValuePreference}
            visibleFields={visibleDetailFields()}
          />
        </div>
      </div>
    </>
  )
}
