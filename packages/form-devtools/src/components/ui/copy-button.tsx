import { useClipboard } from '@ark-ui/solid'
import { Show, splitProps } from 'solid-js'
import { CheckIcon, CopyIcon } from 'lucide-solid'
import { Button } from './button'
import type { JSX } from 'solid-js'
import type { ButtonProps } from './button'
import { cn } from '@/utils'

type CopyButtonProps = Omit<ButtonProps, 'value'> & {
  // The value that should be copied
  value: unknown
  copied?: JSX.Element
  copyTimeout?: number
}

export function CopyButton(props: CopyButtonProps) {
  const [local, others] = splitProps(props, [
    'value',
    'variant',
    'size',
    'class',
  ])

  const variant = () => local.variant ?? 'ghost'
  const size = () => local.size ?? 'icon'

  const clipboard = useClipboard({
    value: '',
    timeout: props.copyTimeout ?? 1200,
  })

  function handleCopy() {
    const text = toClipboardText(props.value)

    clipboard().setValue(text)
    clipboard().copy()
  }

  return (
    <Button
      aria-label="Copy"
      title={clipboard().copied ? 'Copied' : 'Copy to clipboard'}
      variant={variant()}
      size={size()}
      class={cn('text-muted-foreground hover:text-foreground', props.class)}
      onClick={handleCopy}
      {...others}
    >
      <Show when={clipboard().copied} fallback={<CopyIcon />}>
        <CheckIcon />
      </Show>
    </Button>
  )
}

function toClipboardText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'function') return value.toString()
  if (typeof value === 'symbol') return value.toString()
  if (value === null) return 'null'

  const seen = new WeakSet<object>()

  const text = JSON.stringify(
    value,
    (_key, current) => {
      if (typeof current === 'bigint') return `${current}n`
      if (typeof current === 'undefined') return 'undefined'
      if (typeof current === 'function') return current.toString()
      if (typeof current === 'symbol') return current.toString()

      if (current instanceof Map) {
        return {
          type: 'Map',
          entries: Array.from(current.entries()),
        }
      }

      if (current instanceof Set) {
        return {
          type: 'Set',
          values: Array.from(current.values()),
        }
      }

      if (current instanceof RegExp) {
        return current.toString()
      }

      if (current instanceof Error) {
        return {
          name: current.name,
          message: current.message,
          stack: current.stack,
        }
      }

      if (current && typeof current === 'object') {
        if (seen.has(current)) return '[Circular]'
        seen.add(current)
      }

      return current
    },
    2,
  )

  return String(text)
}
