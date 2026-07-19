import { cva } from 'class-variance-authority'
import { For, Show, children, createMemo, splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { LabelProps } from '@/components/ui/label'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + React component.
// These are styled, non-interactive Solid form-layout primitives that preserve
// shadcn's slots, variants, and Tailwind-based design-system API.
// https://ui.shadcn.com/

type DivProps = JSX.HTMLElementTags['div']

function FieldSet(props: JSX.HTMLElementTags['fieldset']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <fieldset
      {...others}
      data-slot="field-set"
      class={cn(
        'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        local.class,
      )}
    />
  )
}

type FieldLegendProps = JSX.HTMLElementTags['legend'] & {
  variant?: 'legend' | 'label'
}

function FieldLegend(props: FieldLegendProps) {
  const [local, others] = splitProps(props, ['class', 'variant'])

  const variant = () => local.variant ?? 'legend'

  return (
    <legend
      {...others}
      data-slot="field-legend"
      data-variant={variant()}
      class={cn(
        'mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
        local.class,
      )}
    />
  )
}

function FieldGroup(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="field-group"
      class={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
        local.class,
      )}
    />
  )
}

const fieldVariants = cva(
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
)

type FieldProps = DivProps & VariantProps<typeof fieldVariants>

function Field(props: FieldProps) {
  const [local, others] = splitProps(props, ['class', 'orientation', 'role'])

  const orientation = () => local.orientation ?? 'vertical'

  return (
    <div
      {...others}
      role={local.role ?? 'group'}
      data-slot="field"
      data-orientation={orientation()}
      class={cn(fieldVariants({ orientation: orientation() }), local.class)}
    />
  )
}

function FieldContent(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="field-content"
      class={cn(
        'group/field-content flex flex-1 flex-col gap-0.5 leading-snug',
        local.class,
      )}
    />
  )
}

function FieldLabel(props: LabelProps) {
  const [local, others] = splitProps(props, ['class', 'data-slot'])

  return (
    <Label
      {...others}
      data-slot="field-label"
      class={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        local.class,
      )}
    />
  )
}

function FieldTitle(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="field-label"
      class={cn(
        'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50',
        local.class,
      )}
    />
  )
}

function FieldDescription(props: JSX.HTMLElementTags['p']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <p
      {...others}
      data-slot="field-description"
      class={cn(
        'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        local.class,
      )}
    />
  )
}

function FieldSeparator(props: DivProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const resolvedChildren = children(() => local.children)
  const hasContent = () => Boolean(resolvedChildren())

  return (
    <div
      {...others}
      data-slot="field-separator"
      data-content={hasContent()}
      class={cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        local.class,
      )}
    >
      <Separator class="absolute inset-0 top-1/2" />
      <Show when={hasContent()}>
        <span
          class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {resolvedChildren()}
        </span>
      </Show>
    </div>
  )
}

type FieldErrorProps = DivProps & {
  errors?: Array<{ message?: string } | undefined>
}

function FieldError(props: FieldErrorProps) {
  const [local, others] = splitProps(props, ['children', 'class', 'errors'])
  const resolvedChildren = children(() => local.children)

  const content = createMemo(() => {
    const child = resolvedChildren()

    if (child) {
      return child
    }

    if (!local.errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(
        local.errors.map((error) => [error?.message, error] as const),
      ).values(),
    ]

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul class="ml-4 flex list-disc flex-col gap-1">
        <For each={uniqueErrors}>
          {(error) => error?.message && <li>{error.message}</li>}
        </For>
      </ul>
    )
  })

  return (
    <Show when={content()}>
      {(resolvedContent) => (
        <div
          {...others}
          role="alert"
          data-slot="field-error"
          class={cn('text-sm font-normal text-destructive', local.class)}
        >
          {resolvedContent()}
        </div>
      )}
    </Show>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
