import { For, createMemo, createSignal } from 'solid-js'
import { Header, HeaderLogo, MainPanel, Select } from '@tanstack/devtools-ui'
import { useResizablePanel } from '../hooks/useResizablePanel'
import { useShellStyles } from '../styles/shell.styles'
import { devtoolsTabs } from './shellTabs'
import type { ResizablePanelArgs } from '../hooks/useResizablePanel'
import type { DevtoolsTabId } from './shellTabs'

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

export function Shell(props: ShellProps) {
  const styles = useShellStyles()
  const leftPanel = useResizablePanel(leftPanelWidth)
  const [activeTab, setActiveTab] = createSignal<DevtoolsTabId>('overview')
  const formOptions = createMemo<Array<FormSelectOption>>(() => [])
  const selectedForm = createMemo(() => formOptions()[0]?.value ?? '-')

  return (
    <MainPanel class={styles().rootPanel}>
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
        <Select
          options={formOptions()}
          value={selectedForm()}
          onChange={() => {}}
        />
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
        />

        <div
          class={`${styles().dragHandle} ${
            leftPanel.isDragging() ? 'dragging' : ''
          }`}
          onMouseDown={leftPanel.startResize}
        />

        <div class={styles().rightPanel} style={{ flex: 1 }} />
      </div>
    </MainPanel>
  )
}
