import { For, Show, createMemo } from 'solid-js'
import { FieldMetaBadge } from '../../FieldMetaBadge'
import { FieldDetailErrorItem } from './FieldDetailErrorItem'
import type { Accessor, ParentProps } from 'solid-js'
import type { DevtoolsFieldDetail } from '@/eventClientTypes'
import type { FieldId } from '@/types/branded'
import { ItemGroup } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JsonTree } from '@/components/ui/json-tree'

interface ErrorsTabProps extends ParentProps {
  data: Accessor<DevtoolsFieldDetail>
  tabValue: 'ui' | 'json'
}

function ErrorsTab(props: ErrorsTabProps) {
  return (
    <TabsContent value={props.tabValue}>
      <Show
        when={props.data().state.meta.original.errors.length > 0}
        fallback={<p class="text-sm text-muted-foreground">No errors</p>}
      >
        {props.children}
      </Show>
    </TabsContent>
  )
}

interface FieldDetailErrorsProps {
  fieldId: FieldId
}

export function FieldDetailErrors({ fieldId }: FieldDetailErrorsProps) {
  const { fieldDetails, fieldMeta } = useFormDevtoolsStore()

  const details = () => fieldDetails.getFieldDetail(fieldId)

  const errors = () => details()?.state.meta.original.errors ?? []
  const hasHiddenErrors = () => {
    const data = details()
    if (!data) return false
    return data.state.meta.isValid && errors().length > 0
  }

  const jsonErrors = createMemo(() => errors().map((e) => e.error))

  const meta = () => fieldMeta.getFieldSummary(fieldId)

  return (
    <Show
      when={details()}
      fallback={
        <>
          <Skeleton class="w-40 h-6" />
          <Skeleton class="w-full h-16" />
        </>
      }
    >
      {(data) => (
        <>
          <Tabs defaultValue="ui">
            <TabsList variant="line">
              <TabsTrigger value="ui">Errors</TabsTrigger>
              <TabsTrigger value="json">Array</TabsTrigger>
              <FieldMetaBadge kind={meta().validity} />
            </TabsList>
            <ErrorsTab data={data} tabValue="ui">
              <ItemGroup class="gap-2">
                <For each={errors()}>
                  {(error) => (
                    <FieldDetailErrorItem
                      fieldId={fieldId}
                      error={error}
                      hasHiddenErrors={hasHiddenErrors}
                    />
                  )}
                </For>
              </ItemGroup>
            </ErrorsTab>
            <ErrorsTab data={data} tabValue="json">
              <JsonTree
                value={jsonErrors()}
                defaultExpandedDepth={3}
                copyable
              />
            </ErrorsTab>
          </Tabs>
        </>
      )}
    </Show>
  )
}
