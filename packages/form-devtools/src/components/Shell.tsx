import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { Header, HeaderLogo, MainPanel } from '@tanstack/devtools-ui'
import { useStyles } from '../styles/use-styles'
import { UtilList } from './UtilList'
import { DetailsPanel } from './DetailsPanel'

import type { Accessor } from 'solid-js'

export function Shell() {
  const styles = useStyles()
  const [leftPanelWidth, setLeftPanelWidth] = createSignal(300)
  const [isDragging, setIsDragging] = createSignal(false)

  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)

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
    <MainPanel>
      <Header>
        <HeaderLogo flavor={{ light: '#eeaf00', dark: '#eeaf00' }}>
          TanStack Form
        </HeaderLogo>
      </Header>

      <div class={styles().mainContainer}>
        <div
          class={styles().leftPanel}
          style={{
            width: `${leftPanelWidth()}px`,
            'min-width': '150px',
            'max-width': '800px',
          }}
        >
          <UtilList selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
        </div>

        <div
          class={`${styles().dragHandle} ${isDragging() ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        <div class={styles().rightPanel} style={{ flex: 1 }}>
          <Show when={selectedKey() != null}>
            <div class={styles().panelHeader}>Details</div>
            <DetailsPanel selectedKey={selectedKey as Accessor<string>} />
          </Show>
        </div>
      </div>
    </MainPanel>
  )
}
