import { Switch as SwitchPrimitive } from '@ark-ui/solid'
import { splitProps, type JSX } from 'solid-js'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type SwitchSize = 'sm' | 'default'

type SwitchRootProps = SwitchPrimitive.RootProps & {
  size?: SwitchSize
}

type SwitchControlProps = SwitchPrimitive.ControlProps

type SwitchLabelProps = Omit<SwitchPrimitive.LabelProps, 'asChild'>

type SwitchProps = Omit<SwitchPrimitive.RootProps, 'children' | 'label'> & {
  children?: JSX.Element
  label?: JSX.Element
  size?: SwitchSize
}

/**
 * The root label wrapper for a binary on/off control.
 *
 * @example
 * ```tsx
 * <SwitchRoot defaultChecked>
 *   <SwitchControl />
 *   <SwitchLabel>Notifications</SwitchLabel>
 * </SwitchRoot>
 * ```
 */
function SwitchRoot(props: SwitchRootProps) {
  const [local, switchProps] = splitProps(props, ['class', 'size', 'children'])

  const size = () => local.size ?? 'default'

  return (
    <SwitchPrimitive.Root
      {...switchProps}
      data-slot="switch"
      data-size={size()}
      class={cn('group/switch', local.class)}
    >
      <SwitchPrimitive.HiddenInput />
      {local.children}
    </SwitchPrimitive.Root>
  )
}

/**
 * The visible switch track and thumb.
 *
 * @example
 * ```tsx
 * <SwitchRoot defaultChecked>
 *   <SwitchControl />
 *   <SwitchLabel>Notifications</SwitchLabel>
 * </SwitchRoot>
 * ```
 */
function SwitchControl(props: SwitchControlProps) {
  const [local, controlProps] = splitProps(props, ['class', 'children'])

  return (
    <SwitchPrimitive.Control
      {...controlProps}
      data-slot="switch-control"
      class={cn(
        'peer relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-data-[size=default]/switch:h-[18.4px] group-data-[size=default]/switch:w-[32px] group-data-[size=sm]/switch:h-[14px] group-data-[size=sm]/switch:w-[24px] after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 dark:data-[state=unchecked]:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        local.class,
      )}
    >
      {local.children ?? (
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          class="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:bg-background group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:bg-background group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
        />
      )}
    </SwitchPrimitive.Control>
  )
}

/**
 * A styled visible label for a SwitchRoot.
 *
 * @example
 * ```tsx
 * <SwitchRoot defaultChecked>
 *   <SwitchControl />
 *   <SwitchLabel>Notifications</SwitchLabel>
 * </SwitchRoot>
 * ```
 */
function SwitchLabel(props: SwitchLabelProps) {
  const [local, labelProps] = splitProps(props, ['class'])

  return (
    <SwitchPrimitive.Label
      {...labelProps}
      asChild={(switchLabelProps) => (
        <Label
          {...switchLabelProps({ class: local.class })}
          data-slot="switch-label"
          // Remember - Root is the label here, not the "label text"
          asChild={(labelProps) => <span {...labelProps()} />}
        />
      )}
    />
  )
}

/**
 * A binary on/off control with shadcn-style sizing and state styling.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" />
 * ```
 */
function Switch(props: SwitchProps) {
  const [local, switchProps] = splitProps(props, [
    'class',
    'children',
    'label',
    'size',
  ])

  return (
    <SwitchRoot
      {...switchProps}
      size={local.size}
      class={cn(local.label && 'flex items-center space-x-2', local.class)}
    >
      <SwitchControl />
      {local.label ? <SwitchLabel>{local.label}</SwitchLabel> : local.children}
    </SwitchRoot>
  )
}

export {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchRoot,
  type SwitchControlProps,
  type SwitchLabelProps,
  type SwitchProps,
  type SwitchRootProps,
}
