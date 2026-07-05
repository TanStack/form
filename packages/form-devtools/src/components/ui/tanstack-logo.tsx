import { splitProps } from 'solid-js'
import type { ComponentProps } from 'solid-js'
import { cn } from '@/utils'

function getLabel(
  adapterName: string | undefined,
  libraryName: string | undefined,
  majorVersion: number | undefined,
) {
  let label = `${adapterName} ${libraryName}`
  if (typeof majorVersion === 'number') {
    label += ` v${majorVersion}`
  }
  return label.trim()
}

interface LibraryLogoProps extends ComponentProps<'a'> {
  brandColor: string
  href: string
  libraryName: string
  adapter?: string
  majorVersion?: number
}

export function LibraryLogo(props: LibraryLogoProps) {
  const [local, other] = splitProps(props, [
    'adapter',
    'majorVersion',
    'libraryName',
    'brandColor',
    'class',
  ])

  return (
    <a
      class={cn(
        'flex flex-col gap-0.5 items-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        local.class,
      )}
      target="_blank"
      {...other}
    >
      <span class="whitespace-nowrap text-base leading-none font-bold text-foreground">
        TANSTACK
      </span>
      <span
        class="text-sm leading-none font-semibold whitespace-nowrap"
        style={{
          color: local.brandColor,
        }}
      >
        {getLabel(local.adapter, local.libraryName, local.majorVersion)}
      </span>
    </a>
  )
}
