import { createSignal, onCleanup, onMount } from 'solid-js'

export interface ResizablePanelArgs {
  defaultPx: number
  minPx: number
  maxPx: number
}

export function useResizablePanel(args: ResizablePanelArgs) {
  const [width, setWidth] = createSignal<number>(args.defaultPx)
  const [isDragging, setIsDragging] = createSignal(false)

  let dragStartX = 0
  let dragStartWidth = 0
  let previousBodyCursor: string | undefined
  let previousBodyUserSelect: string | undefined

  const resetDocumentDragStyles = () => {
    if (previousBodyCursor !== undefined) {
      document.body.style.cursor = previousBodyCursor
      previousBodyCursor = undefined
    }

    if (previousBodyUserSelect !== undefined) {
      document.body.style.userSelect = previousBodyUserSelect
      previousBodyUserSelect = undefined
    }
  }

  const stopResize = () => {
    setIsDragging(false)
    resetDocumentDragStyles()
  }

  const startResize = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    previousBodyCursor = document.body.style.cursor
    previousBodyUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    dragStartX = e.clientX
    dragStartWidth = width()
    setIsDragging(true)
  }

  const resize = (e: MouseEvent) => {
    if (!isDragging()) return

    e.preventDefault()

    const deltaX = e.clientX - dragStartX
    const nextWidth = Math.max(
      args.minPx,
      Math.min(args.maxPx, dragStartWidth + deltaX),
    )

    setWidth(nextWidth)
  }

  onMount(() => {
    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResize)
  })

  onCleanup(() => {
    document.removeEventListener('mousemove', resize)
    document.removeEventListener('mouseup', stopResize)
    resetDocumentDragStyles()
  })

  return {
    width,
    isDragging,
    startResize,
  }
}
