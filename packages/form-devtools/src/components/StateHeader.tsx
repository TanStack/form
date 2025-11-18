import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'

import { useStyles } from '../styles/use-styles'

import type { Accessor } from 'solid-js'
import type { DevtoolsFormState } from '../contexts/eventClientContext'

dayjs.extend(relativeTime)

type StateHeaderProps = {
  selectedInstance: Accessor<DevtoolsFormState | null | undefined>
}

export function StateHeader(props: StateHeaderProps) {
  const styles = useStyles()

  const [now, setNow] = createSignal(dayjs().unix())

  onMount(() => {
    const interval = setInterval(() => setNow(dayjs().unix()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  const state = props.selectedInstance

  const updatedAt = createMemo(() => state()?.date.unix() ?? dayjs().unix())

  const relativeTimeText = createMemo(() => {
    // Math.max to account for signal update
    const diffSeconds = Math.max(now() - updatedAt(), 0)
    if (diffSeconds < 60) {
      return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`
    }
    return dayjs.unix(updatedAt()).fromNow()
  })

  if (!state()) return null

  return (
    <div class={styles().stateHeader}>
      <div class={styles().stateTitle}>Form state</div>
      <div style={{ display: 'flex', 'align-items': 'center', gap: '16px' }}>
        <div class={styles().infoGrid}>
          <div class={styles().infoLabel}>Key</div>
          <div class={styles().infoValueMono}>{state()!.id}</div>
          <div class={styles().infoLabel}>Last Updated</div>
          <div class={styles().infoValueMono}>
            {new Date(updatedAt() * 1000).toLocaleTimeString()} (
            {relativeTimeText()})
          </div>
        </div>
      </div>
    </div>
  )
}
