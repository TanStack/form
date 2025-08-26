import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { useStyles } from '../styles/use-styles'
import { useFormStateArray } from '../contexts/eventClientContext'
// import { UTIL_GROUPS } from './util-groups'
import { UtilList } from './UtilList'
import { DetailsPanel } from './DetailsPanel'

export function Shell() {
  const styles = useStyles()
  const formArray = useFormStateArray()
  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)
  const [leftPanelWidth, setLeftPanelWidth] = createSignal(300)
  const [isDragging, setIsDragging] = createSignal(false)

  const selectedInstance = createMemo(() => {
    const key = selectedKey()
    if (!key) return null
    const instance = formArray().find((form) => form.id === key)
    if (instance) {
      return instance
    }

    return null
  })

  let dragStartX = 0
  let dragStartWidth = 0

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    dragStartX = e.clientX
    dragStartWidth = leftPanelWidth()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return

    e.preventDefault()
    const deltaX = e.clientX - dragStartX
    const newWidth = Math.max(150, Math.min(800, dragStartWidth + deltaX))
    setLeftPanelWidth(newWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  })

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return (
    <div class={styles().devtoolsPanel}>
      <div class={styles().stickyHeader}>TanStack Form</div>

      <div class={styles().mainContainer}>
        <div
          class={styles().leftPanel}
          style={{
            width: `${leftPanelWidth()}px`,
            'min-width': '150px',
            'max-width': '800px',
          }}
        >
          <UtilList
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            utilState={formArray}
          />
        </div>

        <div
          class={`${styles().dragHandle} ${isDragging() ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        <div class={styles().rightPanel} style={{ flex: 1 }}>
          <div class={styles().panelHeader}>Details</div>
          {/* <DetailsPanel
            selectedInstance={selectedInstance}
            utilState={formArray}
          /> */}
          <div>{JSON.stringify(selectedInstance())}</div>
        </div>
      </div>
    </div>
  )
}
