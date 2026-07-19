import { Slider as SliderPrimitive } from '@ark-ui/solid'
import { Index, splitProps } from 'solid-js'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type SliderRootProps = SliderPrimitive.RootProps

type SliderControlProps = Omit<SliderPrimitive.ControlProps, 'children'>

type SliderLabelProps = Omit<SliderPrimitive.LabelProps, 'asChild'>

type SliderValueProps = SliderPrimitive.ValueTextProps

type SliderProps = Omit<SliderRootProps, 'children'>

/**
 * The root component that owns slider state and provides context to its parts.
 *
 * @example
 * ```tsx
 * <SliderRoot defaultValue={[25]}>
 *   <SliderLabel>Volume</SliderLabel>
 *   <SliderValue />
 *   <SliderControl />
 * </SliderRoot>
 * ```
 */
function SliderRoot(props: SliderRootProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children',
    'defaultValue',
    'value',
    'min',
    'max',
  ])

  const min = () => local.min ?? 0
  const max = () => local.max ?? 100
  const defaultValue = () =>
    local.defaultValue ??
    (local.value === undefined ? [min(), max()] : undefined)

  return (
    <SliderPrimitive.Root
      {...others}
      data-slot="slider"
      defaultValue={defaultValue()}
      value={local.value}
      min={min()}
      max={max()}
      class={cn(
        'relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto',
        local.class,
      )}
    >
      {local.children}
    </SliderPrimitive.Root>
  )
}

/**
 * The interactive slider track, range, and value thumbs.
 */
function SliderControl(props: SliderControlProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SliderPrimitive.Control
      {...others}
      data-slot="slider-control"
      class={cn(
        'relative col-span-full flex grow touch-none items-center data-horizontal:w-full data-vertical:h-full data-vertical:min-h-40 data-vertical:flex-col',
        local.class,
      )}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        class="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          class="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Context>
        {(slider) => (
          <Index each={slider().value}>
            {(_, index) => (
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                index={index}
                class="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
              >
                <SliderPrimitive.HiddenInput />
              </SliderPrimitive.Thumb>
            )}
          </Index>
        )}
      </SliderPrimitive.Context>
    </SliderPrimitive.Control>
  )
}

/**
 * A visible label connected to every thumb in its SliderRoot.
 */
function SliderLabel(props: SliderLabelProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SliderPrimitive.Label
      {...others}
      asChild={(sliderLabelProps) => (
        <Label
          {...sliderLabelProps({ class: local.class })}
          data-slot="slider-label"
        />
      )}
    />
  )
}

/**
 * Displays the current slider value or custom value text.
 */
function SliderValue(props: SliderValueProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SliderPrimitive.ValueText
      {...others}
      data-slot="slider-value"
      class={cn('col-start-2 text-sm text-muted-foreground', local.class)}
    />
  )
}

/**
 * A styled slider that supports single values, ranges, and horizontal or
 * vertical orientation.
 *
 * @example
 * ```tsx
 * <Slider defaultValue={[25]} />
 * ```
 */
function Slider(props: SliderProps) {
  return (
    <SliderRoot {...props}>
      <SliderControl />
    </SliderRoot>
  )
}

export {
  Slider,
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderValue,
  type SliderControlProps,
  type SliderLabelProps,
  type SliderProps,
  type SliderRootProps,
  type SliderValueProps,
}
