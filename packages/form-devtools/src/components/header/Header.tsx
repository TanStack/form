import { RefreshCcwIcon } from 'lucide-solid'
import { InternalFormApi } from '@tanstack/form-core/internals'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { ButtonGroup } from '../ui/button-group'
import { Code } from '../ui/code'
import { LibraryLogo } from '../ui/tanstack-logo'
import { BridgeStatusBadge } from './BridgeStatusBadge'
import { FormSelector } from './FormSelector'
import { TabsNav } from './TabsNav'
import { formDevtoolsEventClient } from '@/eventClient.lib'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

interface CryptidNameHintProps {
  class?: string
}

function CrypticNameHint(props: CryptidNameHintProps) {
  const { requestBridgeStatus } = useFormDevtoolsStore().formSelector

  function handleRefreshClick() {
    requestBridgeStatus()
    formDevtoolsEventClient.emit('request-mounted-forms', {})
  }

  return (
    <Tooltip openDelay={400}>
      <TooltipTrigger
        asChild={(innerProps) => (
          <Button
            variant="outline"
            size="icon"
            {...innerProps({
              class: props.class,
              onClick: handleRefreshClick,
            })}
          >
            <RefreshCcwIcon />
          </Button>
        )}
      />
      <TooltipContent class="text-center">
        <span>
          Refresh the mounted forms list.
          <br />
          <br />
          Form names looking a bit cryptic? Add a <Code>formId</Code> option to
          give it a clearer name.
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

interface HeaderProps {
  adapterName: string | undefined
}

export function Header(props: HeaderProps) {
  return (
    <header class="px-3 pt-2 flex flex-wrap items-start gap-x-5 gap-y-2 border-b-2 border-border">
      <LibraryLogo
        libraryName="Form"
        href="https://tanstack.com/form/latest/docs/overview"
        brandColor="oklch(79.5% .184 86.047)"
        adapter={props.adapterName}
        majorVersion={InternalFormApi.majorVersion}
        class="pb-2"
      />
      <ButtonGroup class="pb-2">
        <CrypticNameHint class="icon-sm" />
        <FormSelector />
      </ButtonGroup>
      <BridgeStatusBadge />
      <TabsNav />
    </header>
  )
}
