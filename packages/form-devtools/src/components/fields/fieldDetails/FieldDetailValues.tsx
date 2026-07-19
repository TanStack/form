import { Match, Switch, createMemo } from 'solid-js'
import type { FieldId } from '@/types/branded'
import { JsonTree } from '@/components/ui/json-tree'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFieldDetailValues } from '@/hooks/useFieldDetailValues'

interface JsonViewProps {
  value: unknown
}

function JsonView(props: JsonViewProps) {
  return (
    <JsonTree
      value={props.value}
      defaultExpandedDepth={1}
      class="dark:bg-background/50 border border-border dark:border-none"
      copyable
    />
  )
}

interface FieldDetailValuesProps {
  fieldId: FieldId
}

export function FieldDetailValues({ fieldId }: FieldDetailValuesProps) {
  const info = useFieldDetailValues(fieldId)

  const readyValues = createMemo(() => {
    const data = info()
    return data.status === 'ready' ? data : undefined
  })

  return (
    <Switch>
      <Match when={info().status === 'disabled'}>{null}</Match>
      <Match when={info().status === 'pending'}>
        <Skeleton class="w-40 h-6" />
        <Skeleton class="w-full h-16" />
      </Match>
      <Match when={readyValues()}>
        {(data) => (
          <Tabs defaultValue="value">
            <TabsList variant="line">
              <TabsTrigger value="value">Value</TabsTrigger>
              <TabsTrigger value="defaultValue">Default value</TabsTrigger>
            </TabsList>
            <TabsContent value="value">
              <JsonView value={data().value} />
            </TabsContent>
            <TabsContent value="defaultValue">
              <JsonView value={data().defaultValue} />
            </TabsContent>
          </Tabs>
        )}
      </Match>
    </Switch>
  )
}
