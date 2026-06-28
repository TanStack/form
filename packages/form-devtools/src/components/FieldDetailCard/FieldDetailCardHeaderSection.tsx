import { Show, createMemo, createSignal, onCleanup } from 'solid-js'
import { Button } from '@tanstack/devtools-ui'
import { Copier as CopyIcon } from '@tanstack/devtools-ui/icons'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { EyeClosedIcon, EyeIcon } from '../icons/Eye'
import { FieldDetailMetaTags } from './FieldDetailMetaTags'
import {
  getFieldDetailJsonState,
  stringifyFieldDetailJsonState,
} from './fieldDetailJson'
import type { FieldDetailSnapshot } from './fieldDetailTypes'

const valuesButtonTooltip =
  'Hide values when a large field makes the devtools slow or when the value is sensitive.'

function splitFieldPath(path: string) {
  const lastDotIndex = path.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return {
      ownerPath: '',
      leafName: path,
    }
  }

  return {
    ownerPath: path.slice(0, lastDotIndex + 1),
    leafName: path.slice(lastDotIndex + 1),
  }
}

interface FieldDetailCardHeaderSectionProps {
  field: FieldDetailSnapshot
  includeRawValues: boolean
  showMetaTags: boolean
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
}

export function FieldDetailCardHeaderSection(
  props: FieldDetailCardHeaderSectionProps,
) {
  const styles = useFieldDetailCardStyles()
  const [copyStatus, setCopyStatus] = createSignal<
    'idle' | 'copied' | 'failed'
  >('idle')
  const formGroupName = createMemo(
    () => props.field.formGroup?.name ?? props.field.formGroupName,
  )
  const pathParts = createMemo(() => splitFieldPath(props.field.path))
  let copyStatusTimeout: ReturnType<typeof setTimeout> | undefined

  const resetCopyStatus = () => {
    if (copyStatusTimeout) {
      clearTimeout(copyStatusTimeout)
    }

    copyStatusTimeout = setTimeout(() => setCopyStatus('idle'), 1500)
  }

  const copyFieldDetails = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(
        stringifyFieldDetailJsonState(
          getFieldDetailJsonState(props.field, props.includeRawValues),
        ),
      )
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    } finally {
      resetCopyStatus()
    }
  }

  onCleanup(() => {
    if (copyStatusTimeout) {
      clearTimeout(copyStatusTimeout)
    }
  })

  return (
    <div class={styles().cardHeaderSection}>
      <div class={`${styles().cardHeaderRow} ${styles().cardHeaderTopRow}`}>
        <div class={styles().path} title={props.field.path}>
          <Show when={pathParts().ownerPath.length > 0}>
            <span class={styles().pathOwner}>{pathParts().ownerPath}</span>
          </Show>
          <span class={styles().pathLeaf}>{pathParts().leafName}</span>
        </div>
        <Show when={formGroupName()}>
          <div class={styles().formGroupName}>{formGroupName()}</div>
        </Show>
        <div class={styles().cardHeaderActions}>
          <button
            class={styles().copyButton}
            type="button"
            aria-label={`Copy details for ${props.field.path}`}
            title={`Copy details for ${props.field.path}`}
            onClick={copyFieldDetails}
          >
            <Show when={copyStatus() !== 'idle'} fallback={<CopyIcon />}>
              {copyStatus() === 'copied' ? 'Copied!' : 'Failed'}
            </Show>
          </button>
          <Button
            className={styles().valuesButton}
            variant={props.includeRawValues ? 'primary' : 'secondary'}
            type="button"
            aria-pressed={props.includeRawValues}
            title={valuesButtonTooltip}
            aria-label={`${
              props.includeRawValues ? 'Omit' : 'Include'
            } raw values for ${props.field.path}`}
            onClick={() =>
              props.onRawValueChange(props.field.path, !props.includeRawValues)
            }
          >
            <span>Values</span>
            <span class={styles().valuesButtonIcon} aria-hidden="true">
              <Show when={props.includeRawValues} fallback={<EyeClosedIcon />}>
                <EyeIcon />
              </Show>
            </span>
          </Button>
        </div>
      </div>
      <Show when={props.showMetaTags}>
        <div class={styles().cardHeaderRow}>
          <FieldDetailMetaTags meta={props.field.state.meta} />
        </div>
      </Show>
    </div>
  )
}
