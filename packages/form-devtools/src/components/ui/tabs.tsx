import { cva } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

/**
 * The root container that coordinates tab selection and orientation.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="settings">Settings content</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs(props: TabsPrimitive.RootProps) {
  const [local, others] = splitProps(props, ['class', 'orientation'])

  const orientation = () => local.orientation ?? 'horizontal'
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation()}
      class={cn('group/tabs flex gap-2 data-horizontal:flex-col', local.class)}
      {...others}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type TabsListProps = TabsPrimitive.ListProps &
  VariantProps<typeof tabsListVariants>

/**
 * A styled list that contains the selectable TabsTrigger controls.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="settings">Settings content</TabsContent>
 * </Tabs>
 * ```
 */
function TabsList(props: TabsListProps) {
  const [local, others] = splitProps(props, ['class', 'variant'])

  const variant = () => local.variant ?? 'default'

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant()}
      class={cn(tabsListVariants({ variant: variant() }), local.class)}
      {...others}
    />
  )
}

/**
 * A selectable tab control associated with a matching TabsContent value.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="settings">Settings content</TabsContent>
 * </Tabs>
 * ```
 */
function TabsTrigger(props: TabsPrimitive.TriggerProps) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      class={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-selected:shadow-sm group-data-[variant=line]/tabs-list:data-selected:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-selected:bg-transparent dark:group-data-[variant=line]/tabs-list:data-selected:border-transparent dark:group-data-[variant=line]/tabs-list:data-selected:bg-transparent',
        'data-selected:bg-background data-selected:text-foreground dark:data-selected:border-input dark:data-selected:bg-input/30 dark:data-selected:text-foreground',
        'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-selected:after:opacity-100',
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * The content panel shown when its value matches the selected tab.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="settings">Settings content</TabsContent>
 * </Tabs>
 * ```
 */
function TabsContent(props: TabsPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      class={cn('flex-1 text-sm outline-none', local.class)}
      {...others}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
